/**
 * LARAVEL BACKEND DATABASE STRUCTURE FOR Z-TON BANK
 * 
 * This file contains the Laravel Migration, Factory, and Seeder code 
 * required to support the React Native frontend (Login, Register, and Notifications).
 */

/*
|--------------------------------------------------------------------------
| 1. MIGRATIONS (database/migrations)
|--------------------------------------------------------------------------
*/

/**
 * Users Table Migration
 * Handles data from register.jsx: fullName, email, phone, nin, bvn, account_number
 */
/*
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration { 
    public function up() {
        Schema::create('users', function (Blueprint $table) {
            $table->foreignId('bank_id')->constrained()->onDelete('cascade'); // New foreign key
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->unique();
            $table->string('account_number', 10)->unique();
            $table->string('bvn', 11)->unique();
            $table->string('nin', 11)->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->decimal('balance', 15, 2)->default(0.00); // For the Overview screen
            $table->rememberToken();
            $table->timestamps();
        });
    }
    public function down() { Schema::dropIfExists('users'); }
};
*/

/**
 * Notifications Table Migration
 * Handles data from global-notification.jsx: title, message, icon, type
 */
/*
return new class extends Migration {
    public function up() {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('message');
            $table->string('icon'); // e.g., 'construct-outline'
            $table->enum('type', ['info', 'warning', 'promo'])->default('info');
            $table->timestamps();
        });
    }
    public function down() { Schema::dropIfExists('notifications'); }
};
*/

/**
 * Banks Table Migration
 * Stores the list of banks for selection in the frontend.
 */
/*
return new class extends Migration {
    public function up() {
        Schema::create('banks', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });
    }
    public function down() { Schema::dropIfExists('banks'); }
};
*/

/**
 * Transactions Table Migration (Implicitly needed for Bank Overview)
 */
/*
return new class extends Migration {
    public function up() {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['credit', 'debit']);
            $table->decimal('amount', 15, 2);
            $table->string('description');
            $table->string('reference')->unique();
            $table->timestamps();
        });
    }
    public function down() { Schema::dropIfExists('transactions'); }
};
*/

/*
|--------------------------------------------------------------------------
| 2. FACTORIES (database/factories)
|--------------------------------------------------------------------------
*/

/**
 * UserFactory.php
 */
/*
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory {
    public function definition() {
        return [
            'name' => $this->faker->name(),
            'bank_id' => \App\Models\Bank::factory(), // Associate with a bank
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'account_number' => $this->faker->numerify('##########'), // 10 digits
            'bvn' => $this->faker->numerify('###########'), // 11 digits
            'nin' => $this->faker->numerify('###########'), // 11 digits
            'password' => Hash::make('password'),
            'balance' => $this->faker->randomFloat(2, 1000, 500000),
        ];
    }
}
*/

/**
 * BankFactory.php
 */
/*
namespace Database\Factories;

use App\Models\Bank;
use Illuminate\Database\Eloquent\Factories\Factory;

class BankFactory extends Factory
{
    protected $model = Bank::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->company() . ' Bank',
        ];
    }
}
*/

/**
 * TransactionFactory.php
 */
/*
namespace Database\Factories;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionFactory extends Factory {
    public function definition() {
        return [
            'user_id' => User::factory(),
            'type' => $this->faker->randomElement(['credit', 'debit']),
            'amount' => $this->faker->randomFloat(2, 50, 10000),
            'description' => $this->faker->randomElement(['Transfer to', 'Airtime purchase', 'Utility Bill', 'Account Funding']) . ' ' . $this->faker->name(),
            'reference' => 'ZTN-' . strtoupper($this->faker->bothify('??###?#?')),
        ];
    }
}
*/

/**
 * NotificationFactory.php
 */
/*
class NotificationFactory extends Factory {
    public function definition() {
        $types = [
            ['type' => 'info', 'icon' => 'construct-outline'],
            ['type' => 'warning', 'icon' => 'shield-half-outline'],
            ['type' => 'promo', 'icon' => 'card-outline'],
        ];
        $choice = $this->faker->randomElement($types);
        
        return [
            'title' => $this->faker->sentence(3),
            'message' => $this->faker->paragraph(),
            'icon' => $choice['icon'],
            'type' => $choice['type'],
        ];
    }
}
*/

/*
|--------------------------------------------------------------------------
| 3. SEEDERS (database/seeders)
|--------------------------------------------------------------------------
*/

/**
 * BankSeeder.php
 * Populates the database with the exact bank list from transfer.jsx
 */
/*
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Bank;

class BankSeeder extends Seeder {
    public function run() {
        $banks = [
            'Z-ton Bank', 'Zenith Bank', 'Access Bank', 'Guaranty Trust Bank (GTB)',
            'First Bank of Nigeria', 'United Bank for Africa (UBA)', 'Fidelity Bank',
            'Union Bank of Nigeria', 'Stanbic IBTC Bank', 'Ecobank Nigeria',
            'Polaris Bank', 'Wema Bank'
        ];

        foreach ($banks as $bank) {
            Bank::create(['name' => $bank]);
        }
    }
}
*/

/**
 * DatabaseSeeder.php
 */
/*
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Bank;
use App\Models\Transaction;
use App\Models\Notification;

class DatabaseSeeder extends Seeder {
    public function run() {
        // 1. Seed Banks first
        $this->call(BankSeeder::class);
        $allBanks = Bank::all();

        // 2. Create your main test user
        $testUser = User::factory()->create([
            'name' => 'Usman Adams',
            'email' => 'adams@zton.com',
            'bank_id' => $allBanks->first()->id, // Z-ton Bank
            'account_number' => '0123456789',
            'password' => bcrypt('password123'),
            'balance' => 1234.56,
        ]);

        // Seed transactions for the test user
        Transaction::factory(15)->create(['user_id' => $testUser->id]);

        // 3. Create 10 random users and give them transactions
        User::factory(10)->create()->each(function ($user) use ($allBanks) {
            $user->update(['bank_id' => $allBanks->random()->id]);
            
            Transaction::factory(count: rand(5, 10))->create([
                'user_id' => $user->id
            ]);
        });

        // Seed some global notifications
        Notification::create([
            'title' => 'System Maintenance',
            'message' => 'Z-ton Bank will undergo routine maintenance on Sunday...',
            'icon' => 'construct-outline',
            'type' => 'info'
        ]);

        Notification::factory(5)->create();
    }
}
*/

const DatabasePlaceholder = () => {
    return null; // This file is just a reference for your Laravel Backend
};
export default DatabasePlaceholder;
