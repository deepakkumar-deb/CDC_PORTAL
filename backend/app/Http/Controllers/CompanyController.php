<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Company;
use App\Models\CompanyContactDetail;

class CompanyController extends Controller
{
    // ── Get my company profile ────────────────────────────────
    public function show(Request $request)
    {
        $company = Company::with('contacts')
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'Company profile not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'company' => $company,
        ]);
    }

    // ── Create company profile ────────────────────────────────
    public function store(Request $request)
    {
        $request->validate([
            'company_name'  => 'required|string|max:255',
            'website'       => 'nullable|url',
            'industry'      => 'nullable|string',
            'company_type'  => 'nullable|string',
            'about_company' => 'nullable|string',
            'city'          => 'nullable|string',
            'state'         => 'nullable|string',
            'country'       => 'nullable|string',
            'postal_code'   => 'nullable|string',
            'linkedin_url'  => 'nullable|url',
            'logo'          => 'nullable|image|max:2048',
            'company_file'  => 'nullable|mimes:pdf|max:5120',
            'industry_tags' => 'nullable|array',
            'contacts'      => 'required|array|min:1',
            'contacts.*.contact_type' => 'required|in:head_hr,poc1,poc2',
            'contacts.*.contact_name' => 'required|string',
            'contacts.*.email'        => 'required|email',
            'contacts.*.phone'        => 'nullable|string',
            'contacts.*.designation'  => 'nullable|string',
            'contacts.*.landline'     => 'nullable|string',
        ]);

        // Check if company already exists for this user
        if (Company::where('user_id', $request->user()->id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Company profile already exists. Use update instead.',
            ], 409);
        }

        // Handle logo upload
        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('logos', 'public');
        }

        // Handle company file upload
        $filePath     = null;
        $fileOrigName = null;
        if ($request->hasFile('company_file')) {
            $file         = $request->file('company_file');
            $fileOrigName = $file->getClientOriginalName();
            $filePath     = $file->store('company_files', 'public');
        }

        // Create company
        $company = Company::create([
            'user_id'                    => $request->user()->id,
            'company_name'               => $request->company_name,
            'logo_path'                  => $logoPath,
            'website'                    => $request->website,
            'industry'                   => $request->industry,
            'company_type'               => $request->company_type,
            'about_company'              => $request->about_company,
            'headquarters_address'       => $request->headquarters_address,
            'city'                       => $request->city,
            'state'                      => $request->state,
            'country'                    => $request->country ?? 'India',
            'postal_code'                => $request->postal_code,
            'linkedin_url'               => $request->linkedin_url,
            'date_of_establishment'      => $request->date_of_establishment,
            'annual_turnover'            => $request->annual_turnover,
            'no_of_employees'            => $request->no_of_employees,
            'industry_tags'              => $request->industry_tags,
            'mnc_hq_country'             => $request->mnc_hq_country,
            'mnc_hq_city'                => $request->mnc_hq_city,
            'company_file_path'          => $filePath,
            'company_file_original_name' => $fileOrigName,
        ]);

        // Create contacts
        foreach ($request->contacts as $contact) {
            CompanyContactDetail::create([
                'company_id'   => $company->id,
                'contact_type' => $contact['contact_type'],
                'contact_name' => $contact['contact_name'],
                'designation'  => $contact['designation'] ?? null,
                'email'        => $contact['email'],
                'phone'        => $contact['phone'] ?? null,
                'landline'     => $contact['landline'] ?? null,
                'is_primary'   => $contact['contact_type'] === 'head_hr',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Company profile created successfully.',
            'company' => $company->load('contacts'),
        ], 201);
    }

    // ── Update company profile ────────────────────────────────
    public function update(Request $request)
    {
        $company = Company::where('user_id', $request->user()->id)->first();

        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'Company profile not found.',
            ], 404);
        }

        $request->validate([
            'company_name' => 'sometimes|string|max:255',
            'website'      => 'nullable|url',
            'logo'         => 'nullable|image|max:2048',
            'company_file' => 'nullable|mimes:pdf|max:5120',
            'industry_tags'=> 'nullable|array',
        ]);

        // Handle new logo upload
        $newLogoPath = null;
        if ($request->hasFile('logo')) {
            if ($company->logo_path) {
                Storage::disk('public')->delete($company->logo_path);
            }
            $newLogoPath = $request->file('logo')->store('logos', 'public');
        }

        // Handle new company file upload
        $newFilePath = null;
        $newFileOrigName = null;
        if ($request->hasFile('company_file')) {
            if ($company->company_file_path) {
                Storage::disk('public')->delete($company->company_file_path);
            }
            $file = $request->file('company_file');
            $newFileOrigName = $file->getClientOriginalName();
            $newFilePath = $file->store('company_files', 'public');
        }

        $updateData = $request->except(['logo', 'company_file', 'contacts']);
        if ($newLogoPath !== null) {
            $updateData['logo_path'] = $newLogoPath;
        }
        if ($newFilePath !== null) {
            $updateData['company_file_path'] = $newFilePath;
            $updateData['company_file_original_name'] = $newFileOrigName;
        }

        $company->update($updateData);

        // Update contacts if provided
        if ($request->has('contacts')) {
            foreach ($request->contacts as $contact) {
                CompanyContactDetail::updateOrCreate(
                    [
                        'company_id'   => $company->id,
                        'contact_type' => $contact['contact_type'],
                    ],
                    [
                        'contact_name' => $contact['contact_name'],
                        'designation'  => $contact['designation'] ?? null,
                        'email'        => $contact['email'],
                        'phone'        => $contact['phone'] ?? null,
                        'landline'     => $contact['landline'] ?? null,
                        'is_primary'   => $contact['contact_type'] === 'head_hr',
                    ]
                );
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Company profile updated successfully.',
            'company' => $company->load('contacts'),
        ]);
    }
}