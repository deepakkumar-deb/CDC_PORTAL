<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

use App\Models\AlumniMentor;

class AlumniMentorController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'std_code' => 'required|string|max:10',
            'phone' => 'nullable|string|max:20',
            'graduation_year' => 'required|string|max:4',
            'branch' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'designation' => 'required|string|max:255',
            'linkedin' => 'required|url',
            'years_of_experience' => 'required|integer',
            'preferred_mode' => 'required|string',
            'max_mentees' => 'required|integer',
            'expertise' => 'required|string',
        ]);

        // Save into DB
        AlumniMentor::create($validated);

        // Generate a random filename for the PDF
        $filename = 'alumni_mentor_' . time() . '_' . Str::random(10) . '.pdf';
        $pdfPath = 'pdfs/' . $filename;

        // Generate the PDF from a Blade view
        $pdf = Pdf::loadView('pdf.alumni-mentor', ['data' => $validated]);
        
        // Save PDF to public storage
        Storage::disk('public')->put($pdfPath, $pdf->output());

        // The URL that will be returned to the frontend for downloading
        $pdfUrl = url(Storage::url($pdfPath));

        // Prepare email data
        $adminEmail = env('ADMIN_EMAIL', 'admin@example.com');

        // Send email to admin
        Mail::send('emails.alumni-mentor', ['data' => $validated], function ($message) use ($adminEmail, $pdfPath) {
            $message->to($adminEmail)
                    ->subject('New Alumni Mentorship Application')
                    ->attach(Storage::disk('public')->path($pdfPath));
        });

        return response()->json([
            'success' => true,
            'message' => 'Application submitted and email sent to admin.',
            'pdf_url' => $pdfUrl
        ], 200);
    }
}
