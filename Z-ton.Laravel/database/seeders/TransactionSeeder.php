<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Transaction;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all existing user IDs
        $userIds = User::pluck('id');

        if ($userIds->isEmpty()) {
            return;
        }

        // Create 50 transactions using random existing users
        Transaction::factory(300)->create([
            'sender_id' => fn() => $userIds->random(),
            'receiver_id' => function (array $attributes) use ($userIds) {
                // Ensure receiver is not the same as sender
                return $userIds->reject(fn($id) => $id === $attributes['sender_id'])->random();
            },
            'title' => function (array $attributes) {
                $receiver = User::find($attributes['receiver_id']);
                return 'Transfer to ' . ($receiver->name ?? 'User');
            }
        ]);
    }
}
