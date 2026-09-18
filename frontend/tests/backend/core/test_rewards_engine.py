import pytest
from pydantic import BaseModel

class PurchaseInput(BaseModel):
    amount: float

class RewardEngine:
    @staticmethod
    def calculate_folios(purchase: PurchaseInput, multiplier: int) -> int:
        return int(purchase.amount * multiplier)

def test_rewards_engine_multiplier():
    """
    Si la entrada es una compra de $500 y el estado mockeado del CMS indica un multiplicador x5, 
    el assert debe exigir que se generen exactamente 2500 folios.
    """
    purchase = PurchaseInput(amount=500.0)
    mock_multiplier = 5
    
    folios = RewardEngine.calculate_folios(purchase, mock_multiplier)
    
    assert folios == 2500, f"Expected 2500 folios, got {folios}"
