<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$d = \App\Models\Department::first();
$u = \App\Models\User::role('staff')->first();

if ($u) {
    if (!$u->department_id && $d) {
        $u->department_id = $d->id;
    }
    $u->password = \Illuminate\Support\Facades\Hash::make('password');
    $u->save();
    
    // Also update Staff model if exists
    $staff = \App\Models\Staff::where('email', $u->email)->first();
    if ($staff && !$staff->department_id && $d) {
        $staff->department_id = $d->id;
        $staff->save();
    }
    
    echo "--- Staff Login Details ---\n";
    echo "Email: " . $u->email . "\n";
    echo "Password: password\n";
    echo "Department: " . ($d ? $d->department_name : 'None') . " (ID: " . $u->department_id . ")\n";
} else {
    echo "No staff found. Let's create one.\n";
    $u = \App\Models\User::create([
        'name' => 'Test Staff',
        'email' => 'staff@example.com',
        'password' => \Illuminate\Support\Facades\Hash::make('password'),
        'department_id' => $d ? $d->id : null,
        'username' => 'staff',
    ]);
    
    // Assign role 'staff'
    $u->assignRole('staff');
    
    echo "--- Staff Login Details ---\n";
    echo "Email: " . $u->email . "\n";
    echo "Password: password\n";
    echo "Department: " . ($d ? $d->department_name : 'None') . " (ID: " . ($d ? $d->id : 'null') . ")\n";
}
