// console.log(__dirname);
import express from "express";
import bodyParser from "body-parser";
const app = express();
import {showChat,insertChat,getFriends,check,check_user} from './sql.js'
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

var friends=[]
var user;
var flag=0;
app.get('/', (req, res) => {
  friends=[]
  res.render("login",{flag:flag});
});
app.post('/',async(req,res)=>{
  user=req.body.name;
  var pass=req.body.password;
  if(await check_user(user,pass))
  {
    flag=1;
    res.redirect('/');
  }
  else
  {
    flag=0;
    res.redirect('/'+user);
  }
})
app.get('/:user', async(req, res) => {
    //user=req.params.user;
    friends=await getFriends(req.params.user)
    res.render("home",{friends:friends,user:user,flag:flag});
  });
app.post('/:user',async(req,res)=>{
  flag=0;
  var name=req.body.newName;
  if(await check(name))
  await insertChat(user,name,'');
  else
  flag=1;
  res.redirect('/'+user);
})

app.get('/chat/:name',async(req,res)=>{
  var result=await showChat(user,req.params.name)
  var name=req.params.name;
  res.render("messages",{name:name,user:user,result:result})
})
app.post('/chat/:name',async (req,res)=>
{
  var msg=req.body.message;
  await insertChat(user,req.params.name,msg);
  res.redirect('/chat/'+req.params.name)

})


app.listen(3000, () => {
    console.log(`Example app listening on port`)
  })