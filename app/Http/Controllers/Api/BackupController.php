<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BackupController extends Controller
{
    public function index()
    {
        // List available backups
        $files = Storage::disk('local')->files('backups');
        $backups = [];
        foreach ($files as $file) {
            $backups[] = [
                'name' => basename($file),
                'size' => Storage::disk('local')->size($file),
                'created_at' => date('Y-m-d H:i:s', Storage::disk('local')->lastModified($file)),
            ];
        }
        return response()->json($backups);
    }

    public function create()
    {
        $filename = 'backup-' . date('Y-m-d-H-i-s') . '.sql';
        $path = storage_path('app/backups/' . $filename);
        
        // Ensure backups directory exists
        if (!Storage::disk('local')->exists('backups')) {
            Storage::disk('local')->makeDirectory('backups');
        }

        // Get all tables
        $tables = DB::select('SHOW TABLES');
        $output = "";

        foreach ($tables as $table) {
            $tableName = reset($table);
            
            // Get create table statement
            $createTable = DB::select("SHOW CREATE TABLE $tableName");
            $output .= "\n\n" . $createTable[0]->{'Create Table'} . ";\n\n";

            // Get data
            $rows = DB::table($tableName)->get();
            foreach ($rows as $row) {
                $values = array_map(function ($value) {
                    return $value === null ? "NULL" : "'" . addslashes($value) . "'";
                }, (array) $row);
                $output .= "INSERT INTO $tableName VALUES (" . implode(", ", $values) . ");\n";
            }
        }

        Storage::disk('local')->put('backups/' . $filename, $output);

        return response()->json(['message' => 'Backup created successfully', 'filename' => $filename]);
    }

    public function download($filename)
    {
        if (Storage::disk('local')->exists('backups/' . $filename)) {
            return Storage::disk('local')->download('backups/' . $filename);
        }
        return response()->json(['message' => 'File not found'], 404);
    }

    public function delete($filename)
    {
        if (Storage::disk('local')->exists('backups/' . $filename)) {
            Storage::disk('local')->delete('backups/' . $filename);
            return response()->json(['message' => 'Backup deleted']);
        }
        return response()->json(['message' => 'File not found'], 404);
    }
}
