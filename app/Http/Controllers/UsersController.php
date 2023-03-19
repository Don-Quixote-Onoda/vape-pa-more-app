<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = array();

        $tempUsers = User::all();
        
        foreach($tempUsers as $tempUser) {
            $sex = ($tempUser->sex == 1) ? "Male" : "Female"; 
            $role = ($tempUser->role == 1) ? "Administrator" : "Employee"; 
            $user = array(
                "id" => $tempUser->id,
                "name" => $tempUser->name,
                "firstname" => $tempUser->firstname,
                "lastname" => $tempUser->lastname,
                "sex" => $sex,
                "birthdate" => $tempUser->birthdate,
                "address" => $tempUser->address,
                "phone_number" => $tempUser->phone_number,
                "email" => $tempUser->email,
                "image" => $tempUser->image,
                "role" => $role
            );
            array_push($users, $user);
        }

        return Inertia::render('Users', ['users' => $users]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $filename = time().rand(3, 9). '.'.$request->file('image')->getClientOriginalExtension();
        $request->file('image')->move('uploads/', $filename);
        $sex = ($request->sex == "Male") ? 1 : 0;
        $role = ($request->role == "Administrator") ? 1 : 0;
        $user = User::create([
            'name' => "Test",
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'sex' => $sex,
            'birthdate' => date('Y-m-d', strtotime($request->birthdate)),
            'address' => $request->address,
            'phone_number' => $request->phoneNumber,
            'email' => $request->email,
            'role' => $role,
            'password' => Hash::make($request->password),
            'image' => $filename
        ]);

        return Redirect::route('users.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
