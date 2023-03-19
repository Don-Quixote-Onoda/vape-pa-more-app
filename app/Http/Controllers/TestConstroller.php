<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Logs;
use App\Models\User;

class TestConstroller extends Controller
{
    public function test() {

        // $userlogs = array();
        // $logs = Logs::all();

        // foreach($logs as $log) {
        //     $userlog = array();

        //     array_push($userlog, $log->user);
        //     array_push($userlog, $log->payment);
        //     array_push($userlog, $log->order_detail);

        //     array_push($userlogs, $userlog);
        // }
        // return $userlogs;

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

        return $users;
    }
}
