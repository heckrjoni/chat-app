import mysql from "mysql2";
const pool=mysql.createPool(
    {
        host:'127.0.0.1',
        user:'1st',
        password:'Password@123',
        database:'chat_app'
    }
).promise()
export async function check(username)
{
    const [result]=await pool.query("select * from userlist where username= '"+username+"';")
    if(result.length==0)
        {
            return false;
        }
    return true;
}

export async function check_user(username,password)
{
    const [result]=await pool.query("select * from userlist where username= '"+username+"';")
    if(result.length==0)
        {
            await add_user(username,password)
            return false;
        }
    else{
        var [result1]=await pool.query("select password from userlist where username= '"+username+"';")
        if(result1[0].password==password)
            return false;
        else
            return true;
    }
}
export async function add_user(username,password)
{
    await pool.query("insert into userlist values ('"+username+"','"+password+"');") 
}
export async function showChat(person1,person2)
{
    const [result]=await pool.query("select * from chats where (person1= '"+person1+"' AND person2='"+person2+"') OR (person1= '"+person2+"' AND person2='"+person1+"') order by id desc;")
    return result;
}
export async function insertChat(person1,person2,message)
{
    await pool.query("insert into chats (person1,person2,message) values ('"+person1+"','"+person2+"','"+message+"');")
}
export async function getFriends(user)
{
    const result=[];
    const [result1]=await pool.query("select person2 from chats where (person1= '"+user+"');")
    const [result2]=await pool.query("select person1 from chats where (person2= '"+user+"');")
    for(var j=0;j<result1.length;j++)
    {
        if(!result.includes(result1[j].person2))
        result.push(result1[j].person2)
    }
    for(var j=0;j<result2.length;j++)
    {
        if(!result.includes(result2[j].person1))
        result.push(result2[j].person1)
    }

    return result;
}
