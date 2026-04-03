<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Social categories
        DB::table('social_categories')->insert([
            ['code' => 'GEN', 'name' => 'General'],
            ['code' => 'OBC', 'name' => 'OBC'],
            ['code' => 'SC',  'name' => 'SC'],
            ['code' => 'ST',  'name' => 'ST'],
            ['code' => 'EWS', 'name' => 'EWS'],
            ['code' => 'PWD', 'name' => 'PwD'],
        ]);

        // Programs
        $programs = [
            ['program_name' => 'B.Tech / Dual Degree', 'course' => 'BTech', 'duration_years' => 4, 'is_active' => true],
            ['program_name' => 'Integrated M.Tech',    'course' => 'IMTech','duration_years' => 5, 'is_active' => true],
            ['program_name' => 'M.Tech (GATE)',         'course' => 'MTech', 'duration_years' => 2, 'is_active' => true],
            ['program_name' => 'MBA (CAT)',             'course' => 'MBA',   'duration_years' => 2, 'is_active' => true],
            ['program_name' => 'M.Sc (JAM)',            'course' => 'MSc',   'duration_years' => 2, 'is_active' => true],
            ['program_name' => 'M.Sc.Tech (JAM)',       'course' => 'MScTech','duration_years'=>3,'is_active'=> true],
            ['program_name' => 'Ph.D',                  'course' => 'PhD',   'duration_years' => 4, 'is_active' => true],
        ];
        DB::table('programs')->insert($programs);

        // Departments
        $departments = [
            ['code' => 'CSE',  'department_name' => 'Computer Science & Engineering',             'is_active' => true],
            ['code' => 'ECE',  'department_name' => 'Electronics & Communication Engineering',    'is_active' => true],
            ['code' => 'EE',   'department_name' => 'Electrical Engineering',                     'is_active' => true],
            ['code' => 'ME',   'department_name' => 'Mechanical Engineering',                     'is_active' => true],
            ['code' => 'CE',   'department_name' => 'Civil Engineering',                          'is_active' => true],
            ['code' => 'CHE',  'department_name' => 'Chemical Engineering',                       'is_active' => true],
            ['code' => 'MIN',  'department_name' => 'Mining Engineering',                         'is_active' => true],
            ['code' => 'PET',  'department_name' => 'Petroleum Engineering',                      'is_active' => true],
            ['code' => 'MME',  'department_name' => 'Mineral & Metallurgical Engineering',        'is_active' => true],
            ['code' => 'EP',   'department_name' => 'Engineering Physics',                        'is_active' => true],
            ['code' => 'ENV',  'department_name' => 'Environmental Engineering',                  'is_active' => true],
            ['code' => 'MMM',  'department_name' => 'Mechanical Engineering (Mining Machinery)',  'is_active' => true],
            ['code' => 'MAC',  'department_name' => 'Mathematics & Computing',                    'is_active' => true],
            ['code' => 'AG',   'department_name' => 'Applied Geology',                            'is_active' => true],
            ['code' => 'AGP',  'department_name' => 'Applied Geophysics',                         'is_active' => true],
            ['code' => 'BA',   'department_name' => 'Business Analytics',                         'is_active' => true],
        ];
        DB::table('departments')->insert($departments);

        // Placement stats
        DB::table('placement_stats')->insert([
            'year' => 2024,
            'companies_count' => 500,
            'placement_percent' => 95.00,
            'highest_ctc' => 26000000,
            'departments_count' => 32,
        ]);
    }
}