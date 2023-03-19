<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Logs;

class UserLogsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userlogs = array();
        $logs = Logs::all();

        foreach($logs as $log) {
            $userlog = array();

            array_push($userlog, $log->user);
            array_push($userlog, $log->payment);
            array_push($userlog, $log->order_detail);

            array_push($userlogs, $userlog);
        }
        return Inertia::render('UserLogs', ['userlogs' => $userlogs]);
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
        //
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
