import json
import requests
# import pandas as pd
from hyper.contrib import HTTP20Adapter

loginUrl = "https://xyq-m.cbg.163.com/cgi/api/login"
loginReqDts = json.dumps({"username": "1436089483@qq.com","page_session_id": "01818A6B-515A-8161-43CE-909512EFB14D" })
loginReqHeaders = {
	# ":authority": "xyq-m.cbg.163.com",
	# ":method": "POST",
	# ":path": "/cgi/api/login",
	# ":scheme": "https",
	"accept": "application/json, text/javascript, */*; q=0.01",
	"accept-encoding": "gzip, deflate, br",
	"accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
	"content-length": "81",
	"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
	"cookie": "trace_session_id=018189F1-9FE3-9FF8-DD1F-8DC25F3FFAB6; _flow_group=g8; _external_mark=direct; fingerprint=5obk9n1j1ca5v7fp; reco_sid=iAbhJ30P3aFFB4vC8Epjh6SIdRO8t5HasU2Q4Liv; is_log_active_stat=1; login_id=104dd78c-f201-11ec-8fe6-dfe7a93e550c; NTES_P_UTID=MHjekYvKGmYupmBmaVd8i026TCy3aTQm|1655884724; NTES_SESS=zB6Payd75pKWZg8fmYAdaAE8K9iNvBlHO0YddBpeIWoJNK67NXivTdxKO4QELsozJb914HYtVjQAdMyVnKwmrdyXCDbfbnoejCVsXla3pz.6Yj24VT6G_Nk4vh6F_wy9arzjqQZU8jKOGSwVXpMec46w3L7fU.FTUxnQPKMfpDO4q3BzFCayGddlxFjLiEWp_KOSei0hyOgmEjiS6KQIR3uB2; NTES_PASSPORT=vV8Wu1z0QGip7ZwbBJ.3JaLlQcfr07hvaxR.87WUSVex0UVp0AITEqNUaPSRv8csbi_7PFXuzrS2rricabGB1AhyQJDb2xV_BuWeZWFsWaa11iDQLt35ozpXtzUvo6DHIrgi_0yAfxvJneeBJaBHrsU07jhIsLHDdksvozji6o9q29eQ3RaBIYvdbg3XdlG4k; S_INFO=1655884724|0|##|1436089483@qq.com; P_INFO=1436089483@qq.com|1655884724|1|cbg|00&99|zhj&1655881296&cbg#zhj&331000#10#0#0|&0|cbg_qrcode&cbg|1436089483@qq.com"
	# "origin": "https://xyq-m.cbg.163.com",
	# "referer": "https://xyq-m.cbg.163.com/cgi/mweb/show_login?back_url=%2Fcgi%2Fmweb%2Flogin%2Farea%3Fback_url%3Dhttps%253A%252F%252Fxyq-m.cbg.163.com%252Fcgi%252Fmweb%252Fuser%253F_mobile_tips%253D1",
	# "sec-fetch-dest": "empty",
	# "sec-fetch-mode": "cors",
	# "sec-fetch-site": "same-origin",
	# "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
	# "x-requested-with": "XMLHttpRequest",
}
sessions = requests.session()
sessions.mount(loginUrl, HTTP20Adapter() )
res = sessions.post(loginUrl, headers=loginReqHeaders, data=loginReqDts)

# loginResDts = json.loads(res.text)
print(res.text)

# print(loginResDts)
# tgt = pd.
