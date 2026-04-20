<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Smalot\PdfParser\Parser;

class ExtractionController extends Controller
{
    public function extract(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:pdf|max:5120',
            'type' => 'required|in:jnf,inf,company'
        ]);

        try {
            $parser = new Parser();
            $pdf    = $parser->parseFile($request->file('file')->getPathname());
            $text   = $pdf->getText();

            // Prepare the prompt based on the type
            $prompt = $this->getPrompt($request->type);

            // Send to Gemini API
            $apiKey = env('GEMINI_API_KEY');
            if (empty($apiKey)) {
                return response()->json([
                    'success' => false,
                    'message' => 'GEMINI_API_KEY is missing in the backend .env file. Auto-filling requires the Free Gemini API to analyze the PDF documents.'
                ], 500);
            }

            $response = Http::withHeaders([
                'Content-Type' => 'application/json'
            ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt],
                            ['text' => "Here is the raw text extracted from the PDF:\n\n" . substr($text, 0, 100000)]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.1,
                    'responseMimeType' => 'application/json',
                ]
            ]);

            if ($response->failed()) {
                Log::error('Gemini API Error: ' . $response->body());
                return response()->json(['success' => false, 'message' => 'AI Provider Error'], 500);
            }

            $data = $response->json();
            $jsonText = $data['candidates'][0]['content']['parts'][0]['text'] ?? '{}';

            return response()->json([
                'success' => true,
                'data' => json_decode($jsonText, true)
            ]);
        } catch (\Exception $e) {
            Log::error('Extraction Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to extract data: ' . $e->getMessage()], 500);
        }
    }

    private function getPrompt($type)
    {
        if ($type === 'company') {
            return "You are an AI data extractor. Extract the following JSON fields from the Company Profile PDF text below. Return ONLY pure JSON. Fields to extract:\n" .
                "{\n" .
                "  \"company_name\": \"\",\n" .
                "  \"website\": \"\",\n" .
                "  \"industry\": \"\",\n" .
                "  \"company_type\": \"startup|mnc|psu|private|ngo|other\",\n" .
                "  \"about_company\": \"\",\n" .
                "  \"headquarters_address\": \"\",\n" .
                "  \"city\": \"\",\n" .
                "  \"state\": \"\",\n" .
                "  \"country\": \"\",\n" .
                "  \"postal_code\": \"\",\n" .
                "  \"no_of_employees\": \"\",\n" .
                "  \"annual_turnover\": \"\"\n" .
                "}";
        } elseif ($type === 'jnf') {
            return "You are an AI data extractor. Extract information from the Job Notification Form (JNF) PDF text. Return ONLY a pure JSON object structured as follows, populating fields you can find and leaving missing ones empty strings:\n" .
                "{\n" .
                "  \"designation\": \"\",\n" .
                "  \"job_description\": \"\",\n" .
                "  \"location_type\": \"onsite|remote|hybrid\",\n" .
                "  \"openings_count\": \"\",\n" .
                "  \"skills\": [\"\"],\n" .
                "  \"salary\": {\n" .
                "    \"ctc\": \"(numeric only, no currency/commas)\",\n" .
                "    \"base\": \"(numeric only, no currency/commas)\",\n" .
                "    \"bonus\": \"(numeric only, no currency/commas)\",\n" .
                "    \"bond_details\": \"\"\n" .
                "  },\n" .
                "  \"eligibility_rule\": {\n" .
                "    \"min_cgpa\": \"(float, e.g. 7.5)\",\n" .
                "    \"max_backlogs_allowed\": \"(integer)\",\n" .
                "    \"min_class_10_percent\": \"(numeric)\",\n" .
                "    \"min_class_12_percent\": \"(numeric)\"\n" .
                "  },\n" .
                "  \"selection_process\": {\n" .
                "    \"rounds\": [{\"round_order\": 1, \"round_type\": \"resume|test|gd|interview\", \"mode\": \"online|offline|hybrid\", \"description\": \"\"}],\n" .
                "    \"infrastructure\": {\n" .
                "      \"rooms_required\": \"\",\n" .
                "      \"team_members_required\": \"\",\n" .
                "      \"other_screening\": \"\"\n" .
                "    }\n" .
                "  }\n" .
                "}";
        } elseif ($type === 'inf') {
            return "You are an AI data extractor. Extract information from the Internship Notification Form (INF) PDF text. Return ONLY a pure JSON object structured as follows:\n" .
                "{\n" .
                "  \"internship_title\": \"\",\n" .
                "  \"job_description\": \"\",\n" .
                "  \"location_type\": \"onsite|remote|hybrid\",\n" .
                "  \"openings_count\": \"\",\n" .
                "  \"skills\": [\"\"],\n" .
                "  \"stipend\": {\n" .
                "    \"monthly_stipend\": \"(numeric only)\",\n" .
                "    \"accommodation_provided\": true|false,\n" .
                "    \"ppo_offered\": true|false\n" .
                "  },\n" .
                "  \"eligibility_rule\": {\n" .
                "    \"min_cgpa\": \"(float)\",\n" .
                "    \"max_backlogs_allowed\": \"(integer)\",\n" .
                "    \"min_class_10_percent\": \"(numeric)\",\n" .
                "    \"min_class_12_percent\": \"(numeric)\"\n" .
                "  },\n" .
                "  \"selection_process\": {\n" .
                "    \"rounds\": [{\"round_order\": 1, \"round_type\": \"resume|test|gd|interview\", \"mode\": \"online|offline|hybrid\", \"description\": \"\"}],\n" .
                "    \"infrastructure\": {\n" .
                "      \"rooms_required\": \"\",\n" .
                "      \"team_members_required\": \"\",\n" .
                "      \"other_screening\": \"\"\n" .
                "    }\n" .
                "  }\n" .
                "}";
        }
        return "";
    }
}
