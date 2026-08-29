import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button, Input } from "@base-ui/react"
import { MessageCircle } from 'lucide-react';
import { useState } from "react";

interface RoomProps{
    onJoin:(roomId: string, username: string, onError:()=>void, mode: "create" | "join")=>void
}

export function RoomCard({onJoin}:RoomProps){

    const [loading,setLoading]= useState(false);
    const[username,setUsername]=useState("");
    const[roomId,setRoomId]=useState("")

    const generateRoom=()=>{
        return Math.random().toString(36).substring(2,8)
    }
     

    const createRoom=()=>{
        if(!username.trim()) return
        setLoading(true)
        const roomId=generateRoom()
        setRoomId(roomId)
        onJoin(roomId,username,()=>setLoading(false),"create")
    }

    const enterRoom=()=>{
        if(!username.trim() || !roomId.trim()) return
        
        setLoading(true)
        onJoin(roomId,username,()=>setLoading(false),"join")
    }
    
    

    return(
        <div className="mt-20" >
            <Card className="flex flex-col gap-5 rounded-xl border bg-black text-white shadow  w-full max-w-xl mx-auto p-5 font-inter font-semibold ">
            <CardHeader className="">
                <CardTitle className="flex gap-4 text-2xl ">
                    <MessageCircle/>
                    Real-Time Chat 
                </CardTitle>
                <CardDescription>temporary room that expires after all users exit</CardDescription>
            </CardHeader>
            <CardContent className="mt-4">
               <Button 
               className="bg-white text-black w-full p-2 text-lg "
               disabled={loading} 
               onClick={createRoom}
               >
                {loading? "Creating Room" : "Create A Room"}

                </Button>
            </CardContent>
            <CardFooter className="w-full flex flex-col gap-3">
                <Input className="w-full p-3 border border-white/9"
                     placeholder="enter room Id"
                    value={roomId}
                    onChange={(e)=>setRoomId(e.target.value)}
                />
                <div className="flex w-full gap-2">
                    <Input placeholder="enter username" 
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                        className="flex-1 p-3 border border-white/9"
                     />
                    <Button 
                    onClick={enterRoom}
                    value={roomId}
                    disabled={loading}
                    className="bg-white text-black text-sm p-3 rounded-sm"
                    >
                        {loading ? "joining..." : "join room"}
                    </Button>
                </div>
            </CardFooter>
            
           
            
            </Card>
        </div>
    )
}


