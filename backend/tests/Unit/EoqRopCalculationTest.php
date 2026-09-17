<?php

namespace Tests\Unit;

use App\Services\EoqService;
use App\Services\RopService;
use PHPUnit\Framework\TestCase;

class EoqRopCalculationTest extends TestCase
{
    /**
     * Test rumus EOQ sesuai parameter acuan prompt:
     * D = 600, S = 50.000, H = 5.000 -> EOQ ≈ 109.54 (pembulatan 110 unit)
     */
    public function test_eoq_formula_calculation_with_prompt_parameters(): void
    {
        $eoqService = new EoqService();

        $demand = 600;
        $orderingCost = 50000;
        $holdingCost = 5000;

        $result = $eoqService->calculate($demand, $orderingCost, $holdingCost);

        $this->assertEquals('CALCULATED', $result['status_code']);
        $this->assertEquals(109.54, $result['eoq']);
        $this->assertEquals(110, $result['eoq_rounded']);
        $this->assertStringContainsString('√((2 × 600 × 50.000) / 5.000)', $result['steps']);
    }

    /**
     * Test rumus ROP sesuai parameter acuan prompt:
     * d = 2 unit/hari, L = 5 hari, SS = 3 unit -> ROP = 13 unit
     * (Misal D = 60 dalam periode 30 hari -> d = 60 / 30 = 2)
     */
    public function test_rop_formula_calculation_with_prompt_parameters(): void
    {
        $ropService = new RopService();

        $demand = 60;
        $periodDays = 30; // menghasilkan d = 2.0
        $leadTime = 5;
        $safetyStock = 3;

        $result = $ropService->calculate($demand, $periodDays, $leadTime, $safetyStock);

        $this->assertEquals('CALCULATED', $result['status_code']);
        $this->assertEquals(2.0, $result['average_daily_usage']);
        $this->assertEquals(13.0, $result['rop']);
        $this->assertEquals(13, $result['rop_rounded']);
        $this->assertStringContainsString('(2,00 unit/hari × 5 hari) + 3 unit = 10,00 + 3 = 13,00', $result['steps']);
    }

    /**
     * Test penanganan edge case: Holding Cost = 0 dilarang menyebabkan division by zero
     */
    public function test_eoq_zero_holding_cost_returns_insufficient_data(): void
    {
        $eoqService = new EoqService();

        $result = $eoqService->calculate(600, 50000, 0);

        $this->assertEquals('INSUFFICIENT_DATA', $result['status_code']);
        $this->assertEquals(0.0, $result['eoq']);
        $this->assertNotEmpty($result['errors']);
    }

    /**
     * Test penanganan demand = 0 menghasilkan EOQ = 0 dengan aman
     */
    public function test_eoq_zero_demand_returns_zero_safely(): void
    {
        $eoqService = new EoqService();

        $result = $eoqService->calculate(0, 50000, 5000);

        $this->assertEquals('CALCULATED', $result['status_code']);
        $this->assertEquals(0.0, $result['eoq']);
        $this->assertEquals(0, $result['eoq_rounded']);
    }
}
