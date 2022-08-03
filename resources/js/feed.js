
// $(document).ready(function(){

//     $("#post-form").submit((e)=>{
//         e.preventDefault();
//         const my_content = $("#post-content-field").val() 
//         $.post( "/post/new" , {content: my_content} , function(data) {
            
//             if (data="created") alert("Post Created")
//             else alert("Error occured.")

//         } )
//     })

// })


const cur_user_id = parseInt(document.getElementById("user_id_field").value)

const Form = (props) =>{

    const [content,setContent] = React.useState("")
    const setReload = props.reloadFunction


    const post = (e) => {
        e.preventDefault()
        $.post( "/post/new" , {content: content} , function(data) {
            
            if (data=="Created"){
                alert("Post Created")
                setReload(cur=>!cur)
            } 
            else alert("Error occured.")

        } )
    }
    return <section className="w-3/4  mt-8 m-auto bg-white p-12 pt-10 rounded-md">
    <h2 className="text-2xl bold mb-2">Create a Post</h2>
    <form action="/post/new" method="POST" id="post-form" onSubmit={post} className="flex flex-row">
        <textarea id="post-content-field" name="content" placeholder="What's on your mind?" rows="5"
            className="border-2 px-3 py-2 w-full mr-1" value={content} onChange={(e)=>{setContent(e.target.value)}} ></textarea>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 float-right min-w-max"><i
                className="fa-solid fa-paper-plane"></i> Post New</button>
    </form>
</section>
}

// const deleteThis = () =>{
//     console.log("O")
// }

const Posts = () =>{

    const [posts,setPosts] = React.useState([])
    const [reload,setReload] = React.useState(false)

    React.useEffect(()=>{
        fetch("/post/all")
        .then((data)=>{
            
            data.json()
            .then(final_data=>{
            
                setPosts(final_data)
            })
        })
        .catch((err)=>{
            console.log(err)
        })
    }, [reload])


    return (<div>
        <Form reloadFunction={setReload} />
        {posts.map((post,index) =>(
        <div className=" w-8/12  mt-8 m-auto bg-white p-12 pt-10 rounded-md gap-x-4 flex" key={index}>
            <i className="fa-regular fa-circle-user text-8xl"></i>
            <div className="w-full">
                <div className="flex flex-row justify-between items-center">
                <h3 className="text-lg bold">{post.name}</h3>
                    <span className="text-gray-400 text-sm"> {post.date_posted}</span>
                </div>

            
                <p>
                   {post.content}</p>

                   {cur_user_id==post.user_id &&
                        // <a href=""> Edit {post.user_id}</a>
                        <button className="mt-5 px-2 py-1 rounded-md bg-red-600 text-white  w-fit cursor-pointer hover:bg-red-700" onClick={() =>{
                            // console.log(post.id)
                            // delete from Posts where id=36;
                            $.post("/deletePost",{deleteId:post.id},function(data,status) {
            
                                // alert("Data: " + data + "\nStatus: " + status);
                                if (data=="Created"){
                                    alert("Post Deleted")
                                    setReload(cur=>!cur)
                                } 
                                else alert("Error occured.")
                    
                            })
                        }} >Delete</button>
                    }
                
                
                
            </div>
        </div>
    ))}
    </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById("app"))

root.render(<Posts></Posts>)