<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use GuzzleHttp\Promise\Create;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request){
        $user = User::where("email", $request->email)->first();

        if(!$user){
            return response()->json([
                "status"=>"error",
                "message"=> "Wrong Email"
            ]);
        }

        if(!Hash::check($request->password, $user->password)){
            return response()->json([
                "status"=> "error",
                "message"=> "Wrong Password"
            ]);
        }

        $token = $user->createToken("api-token")->plainTextToken;

        return response()->json([
            "status"=> "success",
            "token"=> $token
        ]);
    }

    public function register(Request $request){
        $user = User::Create([
            "name"=>$request->name,
            "email"=>$request->email,
            "password"=>Hash::make($request->password),
        ]);

        return response()->json([
            "status"=>"success",
            "message"=>"Registered Successfully",
            "user"=> $user,
            ]);
    }
}
