

//destructuring users prop
interface SideBarprops{
    users:
    {   
        id:string,
        username:string,
    }[]
    currentUsername:string
     creator:boolean,
        onBan:(id:string)=>void

}

export function SideBar({users,currentUsername,creator,onBan}:SideBarprops){
    const sortedUsers=[
    ...users.filter(user=>user.username===currentUsername),
    ...users.filter(user=>user.username!==currentUsername)
]

    return(
        <div>
            <div className="h-screen  bg-black border-r border-white/10 font-inter text-white">
                
                <div className="p-5 border-b border-white/10">
                    <div className="text-lg font-semibold flex justify-center p-2">Participants</div>
                    <div className="flex justify-center">
                        {users.length}{users.length===1? " person" :" people"} 
                    </div>
                </div>

                <div className="p-3 overflow-y-auto">
                    {sortedUsers.map((user)=>(
                        <div key={user.id} className="text-white flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
                            <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-semibold">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="truncate text-sm font-medium">
                                     {user.username}
                                </div>
                                {user.username===currentUsername &&(
                                    <span className="text-xs text-white/40">
                                        You
                                    </span>
                                )}
                                <div className="text-xs text-white/40">
                                online</div>
                            </div>
                              {creator && user.username!==currentUsername && (
                                <button onClick={()=>onBan(user.id)}
                                className="text-xs text-red-400 hover:text-red-300">
                                    ban
                                </button>
                            )}
                            <div className="w-2 h-2 rounded-full bg-green-500"/>
                          
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}