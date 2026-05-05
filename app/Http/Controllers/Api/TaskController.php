<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\task;
use App\Models\user;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(){
        $tasks = task::where("user_id", auth()->id())->get();

        return response()->json([
            "stauts"=> "success",
            "task"=> $tasks
        ]);
    }

    public function store(Request $request){
        $task = task::create([
            "user_id"=> auth()->id(),
            "title"=> $request->title,
            "status"=>"panding"
        ]);

        return response()->json([
            "status"=> "success",
            "message"=> "Task Stored Successfully",
            "task"=> $task
        ]);
    }

    public function update(Request $request, $id){
        $task = task::where("id",$id)->where('user_id',auth()->id())->first();

        if(! $task){
            return response()->json([
                'status'=> 'error',
                'message'=> 'Task Not Found'
            ]);
        }

        $task->update([
            'title'=> $request->title ?? $task->title,
            'status'=> $request->status ?? $task->status
        ]);

        return response()->json([
            "status"=>"success",    
            "task"=>$task
        ]);
    }

    public function delete($id){
        $task = task::where("id",$id)->where("user_id",auth()->id())->first();

        if(! $task){
            return response()->json([
                "status"=> "error",
                "message"=> "Task Not Found"
            ]);
        }

        $task->delete();

        return response()->json([
            "status"=> "success",
            "message"=>"Task Deleted"
        ]);
    }

    public function completeTask($id){
        $task = task::where("id",$id)->where("user_id",auth()->id())->first();

        $task = task::where("id",$id)->where('user_id',auth()->id())->first();

        if($task['status'] == 'panding'){
            $task->update([
                'status'=> "Complete"
            ]);
        }else{
            $task->update([
                'status'=>'panding'
            ]);
        }

        return response()->json([
            "status"=>"success",    
            "message"=> "Task Completed"
        ]);

    }

    public function getUserName(){
        $user = user::where("id",auth()->id())->first();

        return response()->json([
            "user"=> $user->name
        ]);
    }
}