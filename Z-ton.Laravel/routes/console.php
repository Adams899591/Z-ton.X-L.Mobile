<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


// this is where u register your commands
// Artisan::command('app:send-cristmas-greatings-command', function () {
//     $this->call('App\Console\Commands\SendCristmasGreatingsCommand');
// })->purpose('Send Cristmas Greatings To All Users');


// run the command yearly to send a christmas messages to Z-ton Bank users
Schedule::command('app:christmas-wishes-command')->yearly(12, 25, 8, '08:00'); 

// run the command daily to send birthday wishes to users whose birthday is today
Schedule::command('app:birthday-wish-command')->dailyAt('09:00');