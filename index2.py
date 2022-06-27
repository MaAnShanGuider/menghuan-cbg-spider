import json
import requests

loginUrl = "https://xyq-m.cbg.163.com/cgi/api/login"
# loginReqDts = json.dumps({"username": "1436089483@qq.com","page_session_id": "01818A6B-515A-8161-43CE-909512EFB14D" })
loginReqDts = {"username": "1436089483@qq.com","page_session_id": "0181A568-B05F-1805-FFCC-1AAAA1345137" }
loginHeaders = {
"accept": "application/json, text/javascript, */*; q=0.01",
"accept-encoding": "gzip, deflate, br",
"accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
"cache-control": "no-cache",
"content-length": "81",
"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
"cookie": "vjuids=5190c7d9.163457a8911.0.62cb55118f42; _ntes_nuid=87435b82ae0ae7a8711f2b21989860ce; vjlast=1525879048.1539873477.12; mail_psc_fingerprint=80a8d6b8bf06047fece1fbd1243c6f63; nts_mail_user=woaimixifan@163.com:-1:1; _ga=GA1.2.956666770.1597156669; _ntes_nnid=87435b82ae0ae7a8711f2b21989860ce,1630849634304; timing_user_id=time_y4JiVorB2c; _flow_group=g4; is_log_active_stat=1; _external_mark=direct; fingerprint=feqfgkfzk7ygabzl; trace_session_id=0181A568-9C20-06CA-4812-393B068D98C7; NTES_P_UTID=VOkylRIDQUWWpRdS6z7MHluqdZlBR9Q9|1656338105; NTES_SESS=Bpzg.qyuuuC6HnSMHChdKWXWtnxtqVJzKiHTPy0rPWb4VQXFV_orx56QsOZNjtKB4P1HOM9dAhZf53TA.QYiw5YFz.A7p70WCTjVrfj.lcvw9WNw2i2q4CU7tN2RZ7_vPX3Dxkvm9_FywZ__K0DKh5vV9I5TcDy42HoVKjOBmH2AdyplYK3tKLUmJj7.ZOC24JKPnXndNXq1434ajCIkQWleJ; NTES_PASSPORT=UngIC0bx43LLxv0LXeDyeqcF59NV9YYP1y6VyJ2.X27NkrW0kCD17oFrg5wpUmv.dqEN5V3i2SwBSSqvgdOJxC8lKF_tOC80cLsY4Y0RfzuQn_5eFBS14ocahBSniXKI88nUS7va7hKRG716dsDYAnFyHe3xv1shA4OV0gnWBrGnRE7sG1kNg9o.Ru8aEWCV1; S_INFO=1656338105|0|##|1436089483@qq.com; P_INFO=1436089483@qq.com|1656338105|1|cbg|00&99|zhj&1656315243&cbg#zhj&330100#10#0#0|&0|cbg|1436089483@qq.com",
"origin": "https://xyq-m.cbg.163.com",
"pragma": "no-cache",
"referer": "https://xyq-m.cbg.163.com/cgi/mweb/show_login?back_url=%2Fcgi%2Fmweb%2Flogin%2Farea%3Fback_url%3D%252Fcgi%252Fmweb%252F",
"sec-fetch-dest": "empty",
"sec-fetch-mode": "cors",
"sec-fetch-site": "same-origin",
"user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
"x-requested-with": "XMLHttpRequest",
}
res =  requests.post(loginUrl, data=loginReqDts,headers=loginHeaders)

print(res.text)