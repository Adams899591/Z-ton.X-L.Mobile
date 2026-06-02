<?php

namespace App\Console\Commands;

use App\Mail\BirthdayWishMail;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class BirthdayWishCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:birthday-wish-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // write the logic to send birthday wishes to users here
        $todayMonth = now()->month;
        $todayDay = now()->day;

        // get all users whose birthday is today
        $users = User::whereMonth('date_of_birth', $todayMonth)
            ->whereDay('date_of_birth', $todayDay)
            ->get();

        foreach ($users as $user) {
            // send email to all users
            Mail::to($user->email)->send(new BirthdayWishMail($user));
        }   
    }
}
