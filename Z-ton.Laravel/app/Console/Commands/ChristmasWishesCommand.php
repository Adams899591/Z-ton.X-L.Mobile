<?php

namespace App\Console\Commands;

use App\Mail\ChristmasWishesMail;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class ChristmasWishesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:christmas-wishes-command';

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
        // this is where u write your logic
        $users = User::all();


        foreach ($users as $user) {
            // send email to all users
            Mail::to($user->email)->send(new ChristmasWishesMail($user));
        };

        return Command::SUCCESS;
    }
}
