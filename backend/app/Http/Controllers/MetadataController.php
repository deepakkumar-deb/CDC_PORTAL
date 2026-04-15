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

        $formatted = $programs->map(function ($item) {
            return [
                'id' => $item->id,
                'label' => $item->department->department_name,
                'degree' => $item->program->program_name,
            ];
        });

        return response()->json([
            'success' => true,
            'programmes' => $formatted,
        ]);
    }
}
