<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProgramDeptMap;

class MetadataController extends Controller
{
    public function programs()
    {
        $programs = ProgramDeptMap::with(['program', 'department'])
            ->where('is_active', true)
            ->get();

        $seen = [];
        $formatted = $programs->map(function ($item) {
            return [
                'id'    => $item->id,
                'label' => $item->department->department_name,
                'degree' => $item->program->program_name,
            ];
        })->filter(function ($item) use (&$seen) {
            $key = $item['label'] . '||' . $item['degree'];
            if (isset($seen[$key])) {
                return false;
            }
            $seen[$key] = true;
            return true;
        })->values();

        return response()->json([
            'success'    => true,
            'programmes' => $formatted,
        ]);
    }
}
