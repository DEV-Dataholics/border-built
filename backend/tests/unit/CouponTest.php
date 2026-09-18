<?php

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use App\Models\CouponModel;
use App\Models\CouponUsageModel;
use App\Models\UserModel;

/**
 * @internal
 */
final class CouponTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected function setUp(): void
    {
        parent::setUp();

        // Seeder para el entorno de pruebas
        $this->seed('CouponSeeder');

        // Crear usuario de prueba en BD si no existe
        $userModel = new UserModel();
        if (!$userModel->find('usr_test_unit')) {
            $userModel->insert([
                'id'          => 'usr_test_unit',
                'email'       => 'unit@borderbuilt.com',
                'name'        => 'Unit Tester',
                'role'        => 'user',
                'password'    => password_hash('password123', PASSWORD_DEFAULT),
                'entries'     => 10,
                'total_spent' => 0.00,
            ]);
        }
    }

    public function testCouponValidationDiscountPercentage(): void
    {
        $couponModel = new CouponModel();
        $coupon = $couponModel->findByCode('BORDER2026');

        $this->assertNotNull($coupon, 'El cupón BORDER2026 debe existir en la BD');
        $this->assertEquals('discount', $coupon['reward_type']);
        $this->assertEquals('percentage', $coupon['discount_type']);
        $this->assertEquals(15.00, (float)$coupon['value']);

        // Calcular descuento para subtotal de $100
        $subtotal = 100.00;
        $discount = $subtotal * ((float)$coupon['value'] / 100);
        $this->assertEquals(15.00, $discount);
    }

    public function testCouponValidationDiscountFixed(): void
    {
        $couponModel = new CouponModel();
        $coupon = $couponModel->findByCode('WELCOME10');

        $this->assertNotNull($coupon, 'El cupón WELCOME10 debe existir en la BD');
        $this->assertEquals('discount', $coupon['reward_type']);
        $this->assertEquals('fixed', $coupon['discount_type']);
        $this->assertEquals(10.00, (float)$coupon['value']);

        $subtotal = 50.00;
        $discount = min($subtotal, (float)$coupon['value']);
        $this->assertEquals(10.00, $discount);
    }

    public function testCouponValidationEntries(): void
    {
        $couponModel = new CouponModel();
        $coupon = $couponModel->findByCode('BORDER700');

        $this->assertNotNull($coupon, 'El cupón BORDER700 de entradas debe existir');
        $this->assertEquals('entries', $coupon['reward_type']);
        $this->assertEquals(700, (int)$coupon['entries_count']);
        $this->assertEquals(1, (int)$coupon['usage_limit']);
    }

    public function testCouponMinPurchaseValidation(): void
    {
        $couponModel = new CouponModel();
        $coupon = $couponModel->findByCode('WELCOME10');

        $subtotalLow = 10.00; // Menor al mínimo de $20
        $minPurchase = (float)($coupon['min_purchase'] ?? 0);

        $this->assertTrue($subtotalLow < $minPurchase, 'Un subtotal de $10 debe ser rechazado si el mínimo es $20');
    }

    public function testCouponClaimEntriesLogic(): void
    {
        $couponModel = new CouponModel();
        $userModel = new UserModel();

        // Reiniciar uso de BORDER700 para la prueba
        $coupon = $couponModel->findByCode('BORDER700');
        $couponModel->update($coupon['id'], ['usage_count' => 0]);

        $userBefore = $userModel->find('usr_test_unit');
        $initialEntries = (int)($userBefore['entries'] ?? 0);

        // Simular lógica de canje de BORDER700
        $couponFresh = $couponModel->findByCode('BORDER700');
        $this->assertLessThan((int)$couponFresh['usage_limit'], (int)$couponFresh['usage_count']);

        $entriesToAdd = (int)$couponFresh['entries_count'];
        $newTotal = $initialEntries + $entriesToAdd;

        // Ejecutar actualización
        $couponModel->update($couponFresh['id'], ['usage_count' => (int)$couponFresh['usage_count'] + 1]);
        $userModel->update('usr_test_unit', ['entries' => $newTotal]);

        $userAfter = $userModel->find('usr_test_unit');
        $couponAfter = $couponModel->findByCode('BORDER700');

        $this->assertEquals($initialEntries + 700, (int)$userAfter['entries']);
        $this->assertEquals(1, (int)$couponAfter['usage_count']);

        // Verificar que segundo canje falla porque usage_count >= usage_limit
        $isLimitReached = (int)$couponAfter['usage_count'] >= (int)$couponAfter['usage_limit'];
        $this->assertTrue($isLimitReached, 'El cupón BORDER700 debe indicar que alcanzó su límite de 1 uso');
    }
}
