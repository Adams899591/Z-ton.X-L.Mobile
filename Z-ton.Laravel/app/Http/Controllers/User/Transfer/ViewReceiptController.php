<?php

namespace App\Http\Controllers\User\Transfer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ViewReceiptController extends Controller
{
    public function viewReceipt(Request $request, $reference_id)
    {
        try { 
            // Try to get the PDF from the public disk
            $filePath = 'receipts/' . $reference_id . '.pdf';
            
            // Check if file exists in public storage
            if (!Storage::disk('public')->exists($filePath)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Receipt not found. Reference: ' . $reference_id,
                    'checked_path' => $filePath
                ], 404);
            }
            
            // Return as a proper downloadable PDF response
            return Storage::disk('public')->download($filePath, 'Receipt_' . $reference_id . '.pdf', [
                'Content-Type' => 'application/pdf',
                'Cache-Control' => 'public, max-age=3600'
            ]);
                
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error retrieving receipt: ' . $e->getMessage()
            ], 500);
        }
    }
}
