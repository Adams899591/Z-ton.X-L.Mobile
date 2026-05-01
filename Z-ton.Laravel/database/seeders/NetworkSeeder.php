<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NetworkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $operators = [
            ['name' => 'MTN', 'color' => '#FFCC00'],
            ['name' => 'Glo', 'color' => '#00FF00'],
            ['name' => '9mobile', 'color' => '#006600'],
            ['name' => 'Airtel', 'color' => '#FF0000'],
        ];

        foreach ($operators as $operator) {
            DB::table('networks')->updateOrInsert(
                ['name' => $operator['name']],
                [
                    'color' => $operator['color'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
