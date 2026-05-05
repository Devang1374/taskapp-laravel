<?php

    use App\Http\Controllers\Api\AuthController;
    use App\Http\Controllers\Api\TaskController;
    use Illuminate\Support\Facades\Route;

    Route::get("/test",function(){
        return response()->json([
            "success"=>true,
            "message"=>"Api Is Working"
        ]);
    });

    Route::middleware(["auth:sanctum"])->group(function(){
        Route::get("/task",[TaskController::class,"index"]);
        Route::post("/task",[TaskController::class,"store"]);
        Route::put("/task/{id}",[TaskController::class,"update"]);
        Route::delete("/task/{id}",[TaskController::class,"delete"]);
        Route::post("/task/{id}",[TaskController::class,"completeTask"]);
        route::get("/task/user",[TaskController::class,"getUserName"]);
    });

    Route::post('/register',[AuthController::class,'register']);
    Route::post('/login',[AuthController::class,'login']);