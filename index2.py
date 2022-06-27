import json
import requests

loginUrl = "https://xyq-m.cbg.163.com/cgi/api/login"
# loginReqDts = json.dumps({"username": "1436089483@qq.com","page_session_id": "01818A6B-515A-8161-43CE-909512EFB14D" })
loginReqDts = {"username": "1436089483@qq.com","page_session_id": "01818A6B-515A-8161-43CE-909512EFB14D" }

res =  requests.post(loginUrl, data=loginReqDts)

print(res.text)