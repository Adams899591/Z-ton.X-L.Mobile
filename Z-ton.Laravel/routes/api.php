<?php

use App\Http\Controllers\Auth\BiometricSetUpController;
use App\Http\Controllers\Auth\DisableBiometricController;
use App\Http\Controllers\Auth\LoginBiometricController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\User\SaveTransfer\SavePaymentController;
use App\Http\Controllers\User\Transfer\AuthenticateBankDetailsController;
use App\Http\Controllers\User\Transfer\ConfirmUserTransferController;
use App\Http\Controllers\User\Transfer\SaveBeneficiaryController;
use App\Http\Controllers\User\Transfer\SavedTransferController;
use App\Http\Controllers\User\Transfer\TransferBiometricController;
use App\Http\Controllers\User\Transfer\TransferController;
use App\Http\Controllers\User\Transfer\ViewReceiptController;
use App\Http\Controllers\User\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


//  handles auth
Route::prefix("auth")->group(function () {
    Route::post("login", [LoginController::class, "login"]);
    Route::post("login-biometric", [LoginBiometricController::class, "loginBiometric"]);
    Route::post("enable-biometric/{userId}", [BiometricSetUpController::class, "enableBiometrictSetUp"]);
    Route::post("disable-biometric/{userId}", [DisableBiometricController::class, "disableBiometrictSetUp"]);
});



// handles user
Route::prefix("user")->group(function () {
    Route::post("fetchBankDetails/{userId}", [UserController::class, "fetchBankDetails"]);
    Route::put("updateInfo/{userId}", [UserController::class, "updateAccountDetails"]);
    Route::post("fetchTransections/{userId}", [UserController::class, "fetchTransections"]);
    Route::delete("deleteTransaction/{transactionId}", [UserController::class, "deleteTransaction"]);
});

// handle save transfer inside user folder
Route::prefix("save-transfer")->group(function(){
   Route::post("save-payment/{userId}", [SavePaymentController::class, "SaveUserPayment"]);
   Route::delete("delete-payment/{paymentId}", [SavePaymentController::class, "deletePayment"]);
});

// handles transfer inside the user folder
Route::prefix("transfer")->group(function () {
    Route::post("fetch-banks", [TransferController::class, "fetchBanks"]);
    Route::post("authenticateBankDetails/{userId}", [AuthenticateBankDetailsController::class, "authenticateBankDetails"]);
    Route::post("confirm-user-transfer", [ConfirmUserTransferController::class, "confirmUserTransfer"]);
    Route::post("save-transfer",[SavedTransferController::class,"SavePayment"]);
    Route::post("biometric-transfer", [TransferBiometricController::class, "biometricTransfer"]);
    Route::post("save-beneficiary", [SaveBeneficiaryController::class, "saveBeneficiary"]);
});

