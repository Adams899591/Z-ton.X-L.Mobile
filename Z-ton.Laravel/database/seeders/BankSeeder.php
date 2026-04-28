<?php

namespace Database\Seeders;

use App\Models\Bank;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BankSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $banks = [
            ['id' => 1, 'name' => 'Z-ton Bank', 'branch' => 'Lagos Branch, Victoria Island'],
            ['id' => 2, 'name' => 'Zenith Bank', 'branch' => 'Abuja Branch, Wuse'],
            ['id' => 3, 'name' => 'Access Bank', 'branch' => 'Port Harcourt Branch, GRA'],
            ['id' => 4, 'name' => 'Guaranty Trust Bank (GTB)', 'branch' => 'Kano Branch, Sabon Gari'],
            ['id' => 5, 'name' => 'First Bank of Nigeria', 'branch' => 'Ibadan Branch, Dugbe'],
            ['id' => 6, 'name' => 'United Bank for Africa (UBA)', 'branch' => 'Enugu Branch, Independence Layout'],
            ['id' => 7, 'name' => 'Fidelity Bank', 'branch' => 'Kaduna Branch, Ahmadu Bello Way'],
            ['id' => 8, 'name' => 'Union Bank of Nigeria', 'branch' => 'Benin City Branch, Ring Road'],
            ['id' => 9, 'name' => 'Stanbic IBTC Bank', 'branch' => 'Owerri Branch, Wetheral Road'],
            ['id' => 10, 'name' => 'Ecobank Nigeria', 'branch' => 'Abeokuta Branch, Kuto'],
            ['id' => 11, 'name' => 'Polaris Bank', 'branch' => 'Jos Branch, Ahmadu Bello Way'],
            ['id' => 12, 'name' => 'Wema Bank', 'branch' => 'Ilorin Branch, Taiwo Road'],
        ];

        foreach ($banks as $bank) {
            Bank::create($bank);
        }
    }
}