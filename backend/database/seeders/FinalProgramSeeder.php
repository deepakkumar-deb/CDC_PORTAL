<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FinalProgramSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing maps
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        DB::table('program_dept_map')->truncate();

        $maps = [
            // B.Tech / Dual (Program ID 1)
            ['id' => 1,  'program_id' => 1, 'department_id' => 6,  'display_name' => 'B.Tech - Chemical Engineering'],
            ['id' => 2,  'program_id' => 1, 'department_id' => 5,  'display_name' => 'B.Tech - Civil Engineering'],
            ['id' => 3,  'program_id' => 1, 'department_id' => 1,  'display_name' => 'B.Tech - Computer Science & Engineering'],
            ['id' => 4,  'program_id' => 1, 'department_id' => 3,  'display_name' => 'B.Tech - Electrical Engineering'],
            ['id' => 5,  'program_id' => 1, 'department_id' => 2,  'display_name' => 'B.Tech - Electronics & Communication Engineering'],
            ['id' => 6,  'program_id' => 1, 'department_id' => 10, 'display_name' => 'B.Tech - Engineering Physics'],
            ['id' => 7,  'program_id' => 1, 'department_id' => 11, 'display_name' => 'B.Tech - Environmental Engineering'],
            ['id' => 8,  'program_id' => 1, 'department_id' => 13, 'display_name' => 'B.Tech - Mathematics & Computing'],
            ['id' => 9,  'program_id' => 1, 'department_id' => 4,  'display_name' => 'B.Tech - Mechanical Engineering'],
            ['id' => 10, 'program_id' => 1, 'department_id' => 7,  'display_name' => 'B.Tech - Mining Engineering'],
            ['id' => 11, 'program_id' => 1, 'department_id' => 12, 'display_name' => 'B.Tech - Mining Machinery Engineering / Mech. Eng.'],
            ['id' => 12, 'program_id' => 1, 'department_id' => 8,  'display_name' => 'B.Tech - Petroleum Engineering'],
            ['id' => 13, 'program_id' => 1, 'department_id' => 9,  'display_name' => 'B.Tech - Mineral & Metallurgical Engineering'],

            // Integrated M.Tech (Program ID 2)
            ['id' => 52, 'program_id' => 2, 'department_id' => 13, 'display_name' => 'Int. M.Tech - Mathematics & Computing'],
            ['id' => 31, 'program_id' => 2, 'department_id' => 14, 'display_name' => 'Int. M.Tech - Applied Geology'],
            ['id' => 32, 'program_id' => 2, 'department_id' => 15, 'display_name' => 'Int. M.Tech - Applied Geophysics'],

            // M.Tech (Program ID 3)
            ['id' => 33, 'program_id' => 3, 'department_id' => 15, 'display_name' => 'M.Tech - Earthquake Science & Engineering'],
            ['id' => 14, 'program_id' => 3, 'department_id' => 6,  'display_name' => 'M.Tech - Chemical Engineering'],
            ['id' => 34, 'program_id' => 3, 'department_id' => 6,  'display_name' => 'M.Tech - Pharmaceutical Science and Engineering'],
            ['id' => 15, 'program_id' => 3, 'department_id' => 5,  'display_name' => 'M.Tech - Civil Engineering'],
            ['id' => 16, 'program_id' => 3, 'department_id' => 1,  'display_name' => 'M.Tech - Computer Science and Engineering'],
            ['id' => 35, 'program_id' => 3, 'department_id' => 3,  'display_name' => 'M.Tech - Power System Engineering'],
            ['id' => 36, 'program_id' => 3, 'department_id' => 3,  'display_name' => 'M.Tech - Power Electronics & Electrical Drives'],
            ['id' => 37, 'program_id' => 3, 'department_id' => 2,  'display_name' => 'M.Tech - Communication & Signal Processing'],
            ['id' => 38, 'program_id' => 3, 'department_id' => 2,  'display_name' => 'M.Tech - Optical Communication & Integrated Photonics'],
            ['id' => 39, 'program_id' => 3, 'department_id' => 2,  'display_name' => 'M.Tech - RF & Microwave Engineering'],
            ['id' => 40, 'program_id' => 3, 'department_id' => 2,  'display_name' => 'M.Tech - VLSI Design'],
            ['id' => 19, 'program_id' => 3, 'department_id' => 11, 'display_name' => 'M.Tech - Environmental Science & Engineering'],
            ['id' => 41, 'program_id' => 3, 'department_id' => 4,  'display_name' => 'M.Tech - Fuel and Energy Engineering'],
            ['id' => 42, 'program_id' => 3, 'department_id' => 9,  'display_name' => 'M.Tech - Mineral Engineering'],
            ['id' => 43, 'program_id' => 3, 'department_id' => 9,  'display_name' => 'M.Tech - Metallurgical Engineering'],
            ['id' => 25, 'program_id' => 3, 'department_id' => 4,  'display_name' => 'M.Tech - Industrial Engineering & Management'],
            ['id' => 44, 'program_id' => 3, 'department_id' => 13, 'display_name' => 'M.Tech - Data Analytics'],
            ['id' => 45, 'program_id' => 3, 'department_id' => 4,  'display_name' => 'M.Tech - Machine Design'],
            ['id' => 46, 'program_id' => 3, 'department_id' => 4,  'display_name' => 'M.Tech - Manufacturing Engineering'],
            ['id' => 47, 'program_id' => 3, 'department_id' => 4,  'display_name' => 'M.Tech - Thermal Engineering'],
            ['id' => 22, 'program_id' => 3, 'department_id' => 7,  'display_name' => 'M.Tech - Mining Engineering'],
            ['id' => 48, 'program_id' => 3, 'department_id' => 7,  'display_name' => 'M.Tech - Geomatics'],
            ['id' => 49, 'program_id' => 3, 'department_id' => 7,  'display_name' => 'M.Tech - Tunneling and Underground Space Technology'],
            ['id' => 24, 'program_id' => 3, 'department_id' => 8,  'display_name' => 'M.Tech - Petroleum Engineering'],

            // MSc Tech (Program ID 6)
            ['id' => 50, 'program_id' => 6, 'department_id' => 14, 'display_name' => 'M.Sc. Tech - Applied Geology'],
            ['id' => 51, 'program_id' => 6, 'department_id' => 15, 'display_name' => 'M.Sc. Tech - Applied Geophysics'],

            // MBA (Program ID 4)
            ['id' => 27, 'program_id' => 4, 'department_id' => 16, 'display_name' => 'MBA - Business Analytics'],
            ['id' => 26, 'program_id' => 4, 'department_id' => 15, 'display_name' => 'MBA (Finance/Marketing/HR/Operations)'],

            // M.Sc (Program ID 5)
            ['id' => 30, 'program_id' => 5, 'department_id' => 10, 'display_name' => 'M.Sc - Physics'],
            ['id' => 29, 'program_id' => 5, 'department_id' => 6,  'display_name' => 'M.Sc - Chemistry'],
            ['id' => 28, 'program_id' => 5, 'department_id' => 13, 'display_name' => 'M.Sc - Mathematics & Computing'],
        ];

        DB::table('program_dept_map')->insert($maps);
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();
    }
}
