import pytest
import asyncio
from httpx import AsyncClient, ASGITransport
from fastapi import FastAPI

# Mock FastAPI app for webhook reception
app = FastAPI()

processed_ids = set()
wallet_balance = 0
lock = asyncio.Lock()

@app.post("/api/webhooks/checkout")
async def checkout_webhook(payload: dict):
    global wallet_balance
    tx_id = payload.get("idempotency_key")
    
    async with lock:
        if tx_id in processed_ids:
            return {"status": "ignored", "detail": "Already processed"}
        processed_ids.add(tx_id)
        
    wallet_balance += payload.get("amount", 0)
    await asyncio.sleep(0.01)  # Simulate DB IO
    return {"status": "success"}

@pytest.mark.asyncio
async def test_concurrent_webhooks_idempotency():
    global processed_ids, wallet_balance
    processed_ids.clear()
    wallet_balance = 0
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {"idempotency_key": "tx_uuid_555", "amount": 100}
        
        # Fire 3 concurrent requests
        responses = await asyncio.gather(
            client.post("/api/webhooks/checkout", json=payload),
            client.post("/api/webhooks/checkout", json=payload),
            client.post("/api/webhooks/checkout", json=payload)
        )
        
        status_codes = [res.status_code for res in responses]
        assert all(code == 200 for code in status_codes)
        
        # System processed the UUID exactly once
        assert len(processed_ids) == 1
        assert wallet_balance == 100
