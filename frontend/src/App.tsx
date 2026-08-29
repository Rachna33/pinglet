import { useState, useRef } from 'react'

import './App.css'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"
import { RoomCard } from './components/RoomCard'
import { Button } from '@base-ui/react'
import { SideBar } from './components/SideBar'


function App() {


  const [messages, setMessages] = useState<{ username: string, message: string }[]>([])
  const [users,setUsers]=useState<{id:string,username:string}[]>([])
  const[creator, setCreator]=useState(false)
  const wsRef=useRef<WebSocket| null>(null)
  const usernameRef=useRef("")
  const roomIdref=useRef("")
  const idRef=useRef("")
  const [hasjoined,setHasJoined]=useState(false)
  const handle=(roomId: string, username: string, onError:()=> void, mode: "join"|"create")=>{
   
    const ws= new WebSocket(import.meta.env.VITE_WS_URL);
    wsRef.current=ws
    usernameRef.current=username
    roomIdref.current=roomId
    
    ws.onopen=()=>{
      ws.send(JSON.stringify({
        type: mode,
        payload:{roomId,username}
        })
        
      )
    }
    ws.onmessage=(event)=>{
      const data=JSON.parse(event.data)
      if(data.type==="error"){
        onError()
        alert(data.message)
        return
      }
      if(data.type==="joined"){
        setHasJoined(true)
        setCreator(data.payload.creator)
        idRef.current=data.payload.id
        return
      }
      if(data.type==="users"){
        setUsers(data.payload)
        return
      }
      
      if(data.type=="chat"){
        setMessages(m=>[...m, {username: data.username, message: data.message}])
        return

      }

      if(data.type=="banned"){
        alert("you have been banned")
        setHasJoined(false)
        setMessages([])
        setUsers([])
        return
      }
    }

      //closes old connection 
      /*return ()=>{
        ws.close()
      }*/
    ws.onerror=()=>{
      onError()
    }
      
  }

  const leaveRoom=()=>{
    wsRef.current?.close()
    wsRef.current=null
    setHasJoined(false)
    setMessages([])
    setUsers([])
  }
  
  if(!hasjoined){
    return <RoomCard onJoin={handle}></RoomCard> 
   }
  return (
   
  <div className="h-screen md:mx-auto max-w-4xl  bg-black grid grid-cols-[200px_1fr] ">
    <SideBar users={users} currentUsername={usernameRef.current} creator={creator}
    onBan={(id)=>{
      wsRef.current?.send(
        JSON.stringify({type:"ban", payload:{id}})
      )
    }}/>

    <div className='grid grid-rows-[auto_1fr_auto] h-screen'>
        <div className='w-full flex justify-between items-center p-4 bg-neutral-900 text-white '>
      <span className=''>Room:{roomIdref.current}</span>
      <Button className="bg-red-500 rounded-md p-3"
      onClick={leaveRoom}
      >
        leave
      </Button>
      </div>
      {/* outer div controls the message body and how it stacks */}
      <div className="  overflow-y-auto flex flex-col gap-3 p-3 
      scrollbar ">
      {messages.map((msg, i) => (
        <Message
          key={i}
          align={msg.username === usernameRef.current ? "end" : "start"}
        >
          <MessageAvatar>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
              </Avatar>
           </MessageAvatar>
          <MessageContent>
            <Bubble>
              
              <BubbleContent>
                <div className='text-green-600'>{msg.username ===usernameRef.current
                  ?"you": msg.username}</div>
                {msg.message}
                
              </BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      ))}
      </div>
      
      <div className=" w-full p-2 text-white flex shrink-0 ">
      <textarea id="message" className="flex-1 p-1 mx-3 rounded-2xl bg-neutral-900 " />
      <Button
        onClick={() => {
          const input = document.getElementById("message") as HTMLInputElement
          const message = input.value
          wsRef.current?.send(
            JSON.stringify({
              type: "chat",
              payload: { message },
            })
          )
          input.value = ""
        }}
        className="bg-green-800 rounded-2xl text-white p-4"
      >
        send message
      </Button>
      </div>

    </div>
    
    
      

    
   
    
    

    
  </div>
 
  
   
)
}
export default App
