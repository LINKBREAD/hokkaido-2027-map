
const PHOTOS = {};          // 离线单文件版：内联 data URI；线上版为空，走 photos/ 目录
const HAS_PHOTO = new Set(["AP1", "HA1", "HA2", "HA3", "HA4", "HA5", "HA6", "HA7", "HA9", "NO1", "NO2", "NO3", "OSK1", "OT1", "OT2", "OT3", "OT4", "SP1", "SP2", "SP3", "SP4", "SP7", "SP8", "SP9", "TO1", "TO2", "TO3", "TO4"]); // 有实拍照片的点位（避免 404 请求）
const THUMB_DIR = 'thumbs/', PHOTO_DIR = 'photos/';
// 大图走 CDN（国内比 github.io 快）；CDN 不通时自动回退本站路径，见 imgFallback()
const IMG_CDN = 'https://fastly.jsdelivr.net/gh/LINKBREAD/hokkaido-2027-map@main/';
const REAL_PHOTO = new Set(["AP1", "HA1", "HA2", "HA3", "HA4", "HA5", "HA6", "HA7", "HA9", "NO1", "NO2", "NO3", "OSK1", "OT1", "OT2", "OT3", "OT4", "SP1", "SP2", "SP3", "SP4", "SP7", "SP8", "SP9", "TO1", "TO2", "TO3", "TO4"]);  // 只有 REAL 里的点位能点开看大图本地实拍
// 缩略图全部内联进 thumbs.js（WebP data URI）：列表和弹窗出图不需要任何网络请求
function hasPhoto(id){ return !!(PHOTOS[id] || HAS_PHOTO.has(id)); }
function thumbSrc(id){ return PHOTOS[id] || (window.THUMBS && window.THUMBS[id]) || ''; }
function fullSrc(id){ return PHOTOS[id] || IMG_CDN + PHOTO_DIR + id + '.webp'; }
// CDN 卡住（不报错只是慢）时主动切回本站相对路径
function armFallback(img, local, ms){
  if(!img || !local) return;
  const t = setTimeout(function(){
    if(img.complete && img.naturalWidth > 0) return;
    img.src = local;
  }, ms || 1200);
  img.addEventListener('load', function(){ clearTimeout(t); });
  img.addEventListener('error', function(){ clearTimeout(t); img.src = local; });
}
const SITE_URL = "https://linkbread.github.io/hokkaido-2027-map/";

// ==== SPOTS_START ====
// ---------- 分类 ----------
const CATS = {
  airport:     {name:'机场门户', color:'#64748B', icon:'✈️'},
  sapporo:     {name:'札幌',     color:'#2563EB', icon:'❄️'},
  otaru:       {name:'小樽',     color:'#0E9594', icon:'🕯️'},
  noboribetsu: {name:'登别',     color:'#E63946', icon:'♨️'},
  toya:        {name:'洞爷',     color:'#0891B2', icon:'🌊'},
  hakodate:    {name:'函馆',     color:'#EA580C', icon:'🌃'},
  osaka:       {name:'大阪中转', color:'#7C3AED', icon:'🏙️'},
};

// ---------- 景点数据 ----------
const SPOTS = [
  {id:'AP1',day:'2/9 · 2/15',cat:'airport',type:'机场',name:'新千岁机场',lat:42.7752,lng:141.6923,
   addr:'北海道千歳市美々（JR快速约40分钟到札幌市区）', hours:'航站楼全天（商店约8:00–21:00）', fee:'—',
   hist:'北海道空中门户与本次行程起止点。机场本身就是景点：3F「微笑之路」有哆啦A梦惊喜空中乐园、Hello Kitty Happy Flight、宝可梦商店；别忘了一支白色恋人软冰淇淋和海鲜盖饭收官。',
   near:'去程 NH577 于 2/9 10:30 抵达（大阪神户起飞 08:40）；返程 NH578 于 2/15 18:30 起飞，建议 16:00 前到机场。伴手礼集中在2F。'},

  {id:'SP1',day:'2/9',cat:'sapporo',type:'景点',name:'北海道大学·综合博物馆',lat:43.0716,lng:141.3401,
   addr:'札幌市北区北10条西8丁目', hours:'博物馆10:00–17:00（周一休）', fee:'免费',
   hist:'飘雪的校园静谧祥和，银杏大道与白杨林道雪后如同白色隧道，人流稀少，有几分孤独美学的味道。综合博物馆免费开放，纪念品商店的窗外雪景本身就是一幅画，咖啡馆也值得一坐。',
   near:'JR札幌站北口步行约10分钟；可顺路走到钟楼方向。'},
  {id:'SP2',day:'2/9–2/11',cat:'sapporo',type:'景点',name:'白色恋人公园',lat:43.0883,lng:141.2713,
   addr:'札幌市西区宮の沢2条2丁目', hours:'10:00–18:00（收费区最终入场16:30）', fee:'园区免费／工厂参观 1200円',
   hist:'欧洲古堡风格的巧克力工厂。🔴 价格纠正：园区（玫瑰园、商店、餐饮）免费，但<b>进「白色恋人工厂」等收费区要 1,200 円/人</b>，不是全免费。2026/7/30 新工厂已开幕。⚠️ 营业 10:00–18:00（不是9点），收费区 <b>16:30 停止入场</b>，学习基地可可豆荚 15:30 截止——下午才去会来不及。体验课（品鉴/绘画/曲奇装饰）需<b>官网提前预约</b>，套票含门票可优先入场。❄️ 格列佛小镇室外乐园冬季停运。重点玩法：冰箱贴DIY——进园先冲门店领整理券（下午可能停发），按整理券时间回来上传照片定制，可刻日期，制作约30分钟，等货时先去吃饭。Google 搜 Nagoyakatei 回转寿司（11:00 营业、步行10分钟）不排队。',
   near:'地铁东西线「宮の沢」站步行约7分钟；傍晚亮灯更梦幻。建议上午10点开园就到，2小时够用。'},
  {id:'SP3',day:'2/9–2/11',cat:'sapporo',type:'景点',name:'中岛公园',lat:43.0482,lng:141.3509,
   addr:'札幌市中央区中島公園1', hours:'全天', fee:'免费',
   hist:'雪很厚、游客很少的城市绿洲：玩雪的小朋友、遛狗和滑雪的居民、安静看雪的老人，能真实感受到北海道原本的生活状态。角落里大大小小的雪人充满趣味，连自动贩卖机都顶着一床雪被子。',
   near:'地铁南北线「中島公園」站直达；园内有丰平馆（白色洋馆）与天文台。'},
  {id:'SP4',day:'2/9',cat:'sapporo',type:'景点',name:'大通公园·札幌电视塔',lat:43.0610,lng:141.3564,
   addr:'札幌市中央区大通西1丁目', hours:'电视塔展望台9:00–22:00（21:50停止入场）', fee:'展望台成人1000円',
   hist:'札幌的城市轴线。🎊 <b>第77届札幌冰雪节官方已定 2027/2/4（四）–2/11（四·建国纪念日）</b>，大通会场就在脚下，1.5公里巨型雪雕免费参观、每晚亮灯至22:00，薄野会场冰雕亮至23:00。你在札幌的 2/9–2/11 三天全程覆盖。⚠️ <b>2/11 是国定假日＋雪祭最后一天，人最多</b>——建议 2/9 傍晚或 2/10 晚上来看亮灯，2/11 趁上午人少先逛，下午再出发去登别。电视塔90米展望台可俯瞰整条灯海，白天看雪雕全景也很值。',
   near:'地铁「大通」站直达；地下步行街连通札幌站，雪天不用走地面。从普乐美雅酒店步行约15分钟或地铁2站。'},
  {id:'SP7',day:'2/9–2/10',cat:'sapporo',type:'美食',name:'炉ばた焼 ウタリ（炉端烧）',lat:43.0557,lng:141.3510,
   addr:'札幌市中央区南5条西5丁目', hours:'17:00–23:00（L.O.22:30，周日休）', fee:'人均约300元',
   hist:'薄野最古老的炉端烧，日剧《First Love 初恋》取景地。番屋风店面中央是千年虾夷松大围炉，女将在面前炭烤喜知次、帆立贝与烤饭团，烟雾缭绕氛围感拉满。全吧台座位不多，强烈建议提前预约并预点喜知次。',
   near:'地铁南北线「すすきの」站2番出口步行3分钟。'},
  {id:'SP8',day:'2/9–2/11',cat:'sapporo',type:'美食',name:'うに専門店 世壱屋（海胆饭）',lat:43.0550,lng:141.3470,
   addr:'札幌市中央区南5条西6-9-3 ニュー桂和ビル1F', hours:'8:00–14:00（L.O.13:30，周二休）', fee:'五大うに食べ比べ丼 约6500円',
   hist:'北海道必吃海胆专门店，函馆・余市直送的五大海胆一次吃齐，超级鲜甜，推荐拼金枪鱼的套餐。只能早上去——下午两点就关门，建议当早午餐第一站。🔴 <b>周二定休，而 2/9 正是周二</b>——抵达当天吃不到，请挪到 <b>2/10（周三）或 2/11（周四）早上</b>；若 2/11 去要算好去登别的车次。',
   near:'薄野站步行3分钟，与ウタリ相隔一个街区，可早上海胆饭、晚上炉端烧。'},
  {id:'SP9',day:'2/9–2/11',cat:'sapporo',type:'酒店',name:'札幌中岛公园普乐美雅酒店',lat:43.0432,lng:141.3519,
   addr:'札幌市中央区南10条西6丁目1-21', hours:'入住 2/9–2/11（2晚）· 新标准大床房（禁烟）', fee:'已预订 ✅',
   hist:'本次札幌大本营。紧邻中岛公园，高层房间窗外就是茫茫白雪的园景，夜晚很安静。大堂有免费饮料吧，早餐评价很高。设施是「精致的老派五星」风格，干净规整。',
   near:'地铁南北线「中島公園」站3号出口步行约4分钟；便利店步行2分钟；步行去薄野、狸小路约10–15分钟。'},

  {id:'OT1',day:'2/10',cat:'otaru',type:'景点',name:'小樽运河',lat:43.1977,lng:141.0017,
   addr:'小樽市港町5（浅草桥一带为经典机位）', hours:'全天／雪灯之路点灯约17:00–21:00', fee:'免费',
   hist:'「北方威尼斯」、《情书》取景地。石造仓库群沿运河排开，雪夜配上63盏煤气灯是全年最美时刻。🎊 <b>重大彩蛋：第29届「小樽雪灯之路」2027/2/6（六）–2/13（六）举办，你 2/10 正好在期内</b>——300米运河沿岸摆满雪灯，水面浮着数百只点蜡烛的玻璃浮球，全程免费，是全北海道最浪漫的冬夜场景，17:00–18:00 天刚暗时人最少。沿运河往南走就是堺町通商店街，玻璃、八音盒与甜品店连成一条散步线。⚠️ 活动期间日间游客量也会暴涨，堺町通要挤。',
   near:'JR小樽站步行约10分钟；建议札幌当日往返（快速电车约35分钟）。手宫线会场在车站与运河之间，可一并逛。'},
  {id:'OT2',day:'2/10',cat:'otaru',type:'景点',name:'天狗山缆车·展望台',lat:43.1678,lng:140.9737,
   addr:'小樽市最上2丁目（山麓站乘缆车）', hours:'冬季 9:00–20:00（上行末班19:48）', fee:'冬季往返 2000円',
   hist:'小樽夜景第一名所，北海道三大夜景之一。雪后晴天傍晚上山，城市灯火、石狩湾与雪山一次收齐。🔴 冬夏同价已取消：<b>冬季（11/28–3/28）往返 2,000 円</b>，比夏季贵 200 円；冬季上行末班 19:48、下行 20:00，比夏季早 1 小时。⚠️ 赶上「小樽雪灯之路」时缆车排队极长，实测下山能排近 1 小时——建议 <b>15:00 前</b>到山下，或干脆 19:00 后错峰。山顶零下十几度且风大，必须戴手套帽子，站外冰面极易滑倒。',
   near:'JR小樽站前4号站台中央巴士⑨「天狗山缆车线」约20分钟（240円，每30分钟一班）；或出租车约10分钟。雪灯之路期间山顶站也是会场之一。'},
  {id:'OT3',day:'2/10',cat:'otaru',type:'景点',name:'小樽八音盒堂·古董博物馆',lat:43.1902,lng:140.9961,
   addr:'小樽市入船1丁目／住吉町（堺町通尽头）', hours:'9:00–18:00', fee:'免费入场',
   hist:'本馆是红砖老建筑里的八音盒海洋，2号馆古董博物馆（アンティークミュージアム）藏着超多古董八音盒与自动演奏乐器，工作人员会现场演示能自动弹奏的古董乐器，神奇又治愈。古董控会挪不开脚，联名款玩偶八音盒值得入手。',
   near:'JR南小樽站步行约5分钟；与堺町通商店街无缝衔接。'},
  {id:'OT4',day:'2/10',cat:'otaru',type:'咖啡',name:'北一硝子三号馆·煤油灯咖啡馆',lat:43.1924,lng:140.9956,
   addr:'小樽市堺町7-26', hours:'9:00–18:00', fee:'人均约700–1000円',
   hist:'此行最爱。明治时代石造仓库改建，店内不用一盏电灯，全靠167盏煤油灯照明——挑高屋顶、暗色木梁与星星点点的灯火，像置身星空，短暂隔绝了商业街的喧闹。每天开店时有逐盏点灯的「点灯仪式」，周二至周五下午还有现场钢琴。皇家奶茶软冰淇淋和冰淇淋奶香很浓、不甜，很适合中国胃。',
   near:'堺町通中段；入口藏在三号馆内侧，别错过。'},

  {id:'NO1',day:'2/11',cat:'noboribetsu',type:'景点',name:'登别地狱谷',lat:42.4958,lng:141.1468,
   addr:'登別市登別温泉町', hours:'全天', fee:'免费',
   hist:'约1万年前火山喷发形成的爆裂火口遗迹：灰白与褐色岩层间地热蒸汽喷涌，硫磺味扑鼻，450米木栈道深入谷中，仿佛站在地狱入口。夜晚栈道点亮幽暗灯火，就是著名的「鬼火之路」。登别温泉拥有10种泉质，是日本顶级温泉乡。',
   near:'温泉街步行约5分钟到谷口；道南巴士「登別温泉」终点站下车即是街区。'},
  {id:'NO2',day:'2/11',cat:'noboribetsu',type:'美食',name:'阎魔轩（地狱拉面）',lat:42.4938,lng:141.1429,
   addr:'登別市登別温泉町76-14', hours:'11:00–15:00（不定休）', fee:'1000–2000円',
   hist:'以阎魔与地狱为主题的辛辣拉面店，店内有鬼壁画和熊头饰可合影。招牌「阎魔拉面」红油上卧一条红辣椒，汤底浓郁却能喝到见底，像地狱版 laksa。温泉街午餐首选，人气高要排队。',
   near:'极乐通商店街中段，道南巴士登别温泉终点步行5分钟；顺路可买道产子布丁。'},
  {id:'NO3',day:'2/11',cat:'noboribetsu',type:'温泉酒店',name:'第一泷本馆（住1晚）',lat:42.4932,lng:141.1440,
   addr:'登別市登別温泉町55', hours:'入住 2/11–2/12（1晚）· 西馆标准日式房；入住15:00／退房10:00', fee:'已预订 ✅',
   hist:'1858年创业的老铺，泉源直接引自地狱谷，是日本少见的「硫磺泉本流」温泉酒店。全馆多个汤池随便泡，泡到不想出来——虽然每天都弥漫着硫磺味（像鸡蛋混着旺旺雪饼），但真的很幸福。馆内洗护设施一应俱全，对皮肤和关节友好。',
   near:'地狱谷步行约5分钟；温泉街核心位置。'},

  {id:'TO1',day:'2/12',cat:'toya',type:'景点',name:'洞爷湖温泉街',lat:42.5663,lng:140.8236,
   addr:'虻田郡洞爺湖町洞爺湖温泉', hours:'全天', fee:'免费',
   hist:'北海道西南部的火山口不冻湖，支笏洞爷国立公园核心。湖面终年不结冰，冬晨雾气升腾如水墨。🎊 <b>「洞爷冬彩·音乐花火」冬季限定 2027/2/3–2/24 每晚 20:30 起约5–8分钟、450发</b>，你 2/12 正好在期内，雪中看烟花是此行隐藏惊喜——万世阁湖景房与顶楼露天温泉就能直接看。另「洞爷湖彩灯隧道」约 2026/11–2027/4 每晚亮灯。湖畔足汤与手汤免费。',
   near:'JR洞爷站乘道南巴士约15分钟到温泉街；酒店多提供折扣券。'},
  {id:'TO2',day:'2/12',cat:'toya',type:'景点',name:'有珠山缆车',lat:42.5552,lng:140.8382,
   addr:'洞爺湖町有珠山（昭和新山站乘缆车）', hours:'冬季 9:00–16:00（末班下行16:00）', fee:'往返大人2000円、儿童1000円',
   hist:'俯瞰洞爷湖全景与昭和新山的绝佳方式：登顶后左手是镜面般的洞爷湖与湖中岛，右手是仍在冒烟的昭和新山（1943年地震中平地隆起的活火山）。🔴 <b>冬季营业只剩 9:00–16:00</b>（夏季才是 8:15–17:45）——网上常见的「末班17:45」是夏季时刻，2月按它排会扑空。⚠️ 上行末班比下行末班早，务必 <b>14:30 前</b>上山；洞爷湖展望台约40分钟，加火口原展望台约1小时，两个都走要 1.5–2 小时。❄️ 积雪时火口原方向步道可能封闭，穿防滑鞋。酒店/游客中心常有折扣券记得领。',
   near:'温泉街乘道南巴士到「昭和新山」站下车即是；<b>一天仅约7班，冬季务必先查时刻表</b>；上车投币，不能用IC卡。错过的士约15分钟。'},
  {id:'TO3',day:'2/12',cat:'toya',type:'景点',name:'夕日が浜公园',lat:42.5535,lng:140.7628,
   addr:'洞爺湖町洞爺町（JR洞爷站直走约5分钟）', hours:'全天', fee:'免费',
   hist:'等巴士去洞爷湖的空档顺路一拐就是惊喜：雪堆、蓝海、公园木牌与远处的船，海边的冬日通透得不像话。天气好时能隔着内浦湾看到对岸雪山，是拍「北海道海边车站」氛围照的隐藏机位。',
   near:'JR洞爷站出站直行约5分钟即到海边。'},
  {id:'TO4',day:'2/12',cat:'toya',type:'酒店',name:'洞爷湖万世阁酒店（住1晚）',lat:42.5650,lng:140.8266,
   addr:'虻田郡洞爷湖町洞爷湖温泉21', hours:'入住 2/12–2/13（1晚）· 中央馆湖景双床房；入住15:00／退房10:00', fee:'已预订 ✅',
   hist:'温泉街正中心的老字号湖景酒店，房间正对洞爷湖——2月每晚20:30的冬花火在房间里就能看，顶楼露天温泉望湖与羊蹄山。分东馆/本馆(中央馆)/西馆，前台讲解很细。有札幌站北口⇔酒店的接驳巴士「Express洞爷」（单程1100円、完全预约制、仅限住客：去程札幌13:15发→15:45到，返程酒店10:00发→12:30到）。',
   near:'湖畔足汤、越后屋步行1分钟；道南巴士「洞爷湖温泉」站步行约5分钟。'},

  {id:'HA1',day:'2/13',cat:'hakodate',type:'景点',name:'函馆山夜景',lat:41.7593,lng:140.7046,
   addr:'函館市函館山（山麓缆车站：元町19-7）', hours:'冬季 10:00–21:00（上山末班20:30、下山末班21:00）', fee:'缆车往返1800円／单程1200円；登山巴士单程700円',
   hist:'与香港、那不勒斯并称「世界三大夜景」（日本三大夜景之一）。日落前上山，看砂洲两侧灯火逐层点亮、渔船灯火撒进津轻海峡，最佳时刻是<b>日落后约30分钟</b>。🔴 <b>冬季（11月上旬–4月中旬）登山道路封闭</b>，山顶没有巴士、的士也不能上山——<b>必须买往返票 1,800 円</b>，别买单程。上行末班 20:30、下行末班 21:00，比夏季早一小时。每15分钟一班（每小时00/15/30/45分发车），黄昏人多时会加密到5–10分钟。⚠️ 当天先查山顶实况直播（能见度）再决定是否上山，被云雾罩住就白跑一趟。',
   near:'山麓站与元町教会群、八幡坂相邻，可串成傍晚动线。市电「十字街」站步行约10分钟——冬季这段上坡严重结冰，务必防滑。'},
  {id:'HA2',day:'2/14',cat:'hakodate',type:'景点',name:'五棱郭塔',lat:41.7969,lng:140.7537,
   addr:'函館市五稜郭町43-9', hours:'约9:00–18:00', fee:'成人1200円',
   hist:'107米高的展望塔，360度俯瞰函馆市景与五棱郭星形城郭全貌——冬季雪后星形轮廓镶着白边，比春天还清晰，夜景尤其出名。塔内有箱馆战争史料陈列。',
   near:'市电「五稜郭公園前」站步行约10分钟。'},
  {id:'HA3',day:'2/14',cat:'hakodate',type:'景点',name:'五棱郭公园',lat:41.7972,lng:140.7569,
   addr:'函館市五稜郭町44', hours:'全天（奉行所9:00–17:00）', fee:'公园免费',
   hist:'日本第一座西洋式城郭，江户幕府1864年建成的星形要塞，箱馆战争最后舞台。护城河冬季结冰积雪，从塔上看是完美的五角星。园内的箱馆奉行所复原建筑值得一看。',
   near:'与五棱郭塔一体游览；市电可达。'},
  {id:'HA4',day:'2/13–2/14',cat:'hakodate',type:'景点',name:'八幡坂·元町坡道群',lat:41.7646,lng:140.7118,
   addr:'函館市末広町（八幡坂）', hours:'全天', fee:'免费',
   hist:'函馆因众多坡道被称为「坂之城」：笔直的八幡坂从山脚一路通向港口，尽头是停泊的青函联络船摩周丸，雪后像电影海报。推荐走法：基坂→日和坂→八幡坂→大三坂→二十间坂→函馆山缆车站→谷地坂→护国神社坂→あさり坂，缆车站是分界线，前后两段各半天。',
   near:'市电「十字街」站步行约5分钟；紧邻元町教会群。'},
  {id:'HA5',day:'2/13–2/14',cat:'hakodate',type:'景点',name:'金森红砖仓库',lat:41.7661,lng:140.7154,
   addr:'函館市末広町14-12', hours:'商铺约9:30–19:00', fee:'免费',
   hist:'1909年建成的红砖仓库群，函馆港开埠象征，如今是纪念品与杂货的集合地，挺好逛。推荐找北海道长尾山雀（シマエナガ）钥匙扣，做工很好还能现场刻字。傍晚仓库群亮灯配雪景极出片。',
   near:'八幡坂下坡步行约5分钟；幸运小丑汉堡就在旁边。'},
  {id:'HA6',day:'2/14',cat:'hakodate',type:'景点',name:'特拉皮斯特大修道院',lat:41.8067,lng:140.8270,
   addr:'函館市上湯川町346', hours:'外观自由参观（内部不开放）', fee:'免费',
   hist:'1898年法国传教士建立的日本第一座男子修道院，罗马式砖造建筑藏在笔直的杉木参道尽头，雪落无声，肃穆得像北欧。⚠位置较偏远、班次少，建议预留半天，参观保持安静。',
   near:'函馆巴士「トラピスト入口」下车步行约15分钟；可与汤之川温泉顺游。'},
  {id:'HA7',day:'2/13–2/14',cat:'hakodate',type:'美食',name:'幸运小丑汉堡（Lucky Pierrot）',lat:41.7678,lng:140.7192,
   addr:'函館市末広町23-18（ベイエリア本店，分店众多）', hours:'约10:00–22:00（因店而异）', fee:'汉堡约400–900円',
   hist:'只在函馆才有的传奇汉堡店，多次获评「全日本最好吃汉堡」。必点中华风炸鸡汉堡——酸甜酱汁+嫩滑鸡腿肉，年销50万份，是函馆的灵魂美食。小丑彩绘的店面本身就是打卡点，《名侦探柯南》剧场版也来取过景。',
   near:'金森红砖仓库旁；菜单有中文，招牌套餐880円。'},
  {id:'HA9',day:'2/13–2/15',cat:'hakodate',type:'酒店',name:'函馆JR旅馆（住2晚）',lat:41.7735,lng:140.7272,
   addr:'函馆市若松町12-14（JR函馆站直通）', hours:'入住 2/13–2/15（2晚）· 双床房；入住15:00／退房10:00', fee:'已预订 ✅',
   hist:'2020年开业，与JR函馆站直通——下雪天不用拖行李走雪地，这点太重要了。一楼有十几种枕头的自选区，顶楼有大浴场和能看函馆山的休息室，早餐的海鲜回转寿司很有名。早上退房直接进站，动线零负担。',
   near:'JR函馆站直通；市电「函馆站前」步行3分钟；7-11 步行3分钟。🔴 2/15 最晚 12:30 前必须上车（推荐 11:00 北斗 → 14:40 札幌 → 16:00 新千岁，18:30 起飞）。'},
  {id:'OSK1',day:'2/8 · 2/15',cat:'osaka',type:'酒店',name:'关西机场日航酒店（大阪中转）',lat:34.4344,lng:135.2457,
   addr:'大阪府泉佐野市泉州空港北1番地（关西机场T1直连）', hours:'入住 2/8、2/15–2/16 · 经济舱双床房（已预订✅）', fee:'已预订 ✅',
   hist:'关西机场岛内的日航酒店，与T1航站楼直连，深夜抵达、清晨转机都不用出机场大楼。2/8 晚 NH976 落地 22:00 直接入住，次日去神户机场转 NH577 飞札幌；2/15 晚从北海道飞回大阪后再住一晚，2/16 早班 NH973 回家——两晚都不用早起赶路。',
   near:'关西机场站步行约3分钟。🚢 往返神户机场高速船：首班 06:30（06:20 到 T1 1F 12号巴士站）、末班 22:45，全程 31 分钟，往返票 3,060円（省 700円）。2/16 早班机 9:00 起飞，7 点出门都来得及。'},
];

// ---------- 路线 ----------
const TRIP_ROUTE = ['AP1','SP1','OT1','NO1','TO1','HA1'];   // 新千岁→札幌→小樽→登别→洞爷→函馆
const RETURN_ROUTE = ['HA1','AP1'];                          // 函馆→新千岁 返程

// ==== SPOTS_END ====

// ---------- 地图 ----------
// 性能参数：优先 canvas 渲染、缩放动画节流、减少拖曳时的瓦片请求
const map = L.map('map', {zoomControl:true, tap:true, preferCanvas:true,
  zoomAnimation:true, fadeAnimation:false, markerZoomAnimation:false,
  updateWhenZooming:false, wheelPxPerZoomLevel:120,
  // 手感调优：惯性更跟手、到缩放上下限不再橡皮筋回弹（拖到头就是到头，更干脆）
  inertia:true, inertiaDeceleration:2600, inertiaMaxSpeed:2200,
  bounceAtZoomLimits:false, easeLinearity:.22, wheelDebounceTime:40
}).setView([42.45, 141.35], 8);
map.zoomControl.setPosition('bottomright');

// 底图：界面上始终只有一个地图；后台并发测速，自动挑当前网络下最快的源，
// 某个源在高缩放级别取不到图（放大后空白）时再自动换下一个，用户全程无需选择
const TILE_OPT = {updateWhenIdle:true, updateWhenZooming:false, keepBuffer:1,
  noWrap:false, detectRetina:false};   // 关 retina：高 DPI 手机否则多下 4 倍数据
const SRC = {
  gsi:    {url:'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
           opt:{maxZoom:18, attribution:'© 国土地理院'}},
  gsiStd: {url:'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
           opt:{maxZoom:18, attribution:'© 国土地理院'}},
  osmJp:  {url:'https://tile.openstreetmap.jp/{z}/{x}/{y}.png',
           opt:{maxZoom:19, attribution:'© OpenStreetMap JP'}},
  esri:   {url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
           opt:{maxZoom:18, attribution:'© Esri, HERE, Garmin'}},
};
// 主源 = 国土地理院淡色图（日本境内最快最稳，实测比 Esri 快 3–10 倍）；
// esri 作第一备用，其余仅在连续失败时才会轮到
const ORDER = ['gsi','esri','gsiStd','osmJp'];   // 失败时按此顺序换源
const Z0 = 8, X0 = 228, Y0 = 94;          // 初始视图（setView zoom 8）的中心瓦片
function tileUrl(n, z, x, y){
  return SRC[n].url.replace('{z}', z).replace('{x}', x).replace('{y}', y);
}

let curName = null, mounted = {}, tileOk = 0, errs = 0;
function mount(n){
  if(!n || n === curName) return;
  if(curName && mounted[curName]) map.removeLayer(mounted[curName]);
  if(!mounted[n]) mounted[n] = L.tileLayer(SRC[n].url, Object.assign({}, SRC[n].opt, TILE_OPT));
  curName = n;
  mounted[n].addTo(map);
}
function hideLoad(){
  const l = document.getElementById('tileLoading'); if(l) l.style.display = 'none';
  document.getElementById('tileHint').style.display = 'none';
  const m = document.getElementById('map'); if(m) m.classList.add('tiles-ready');
}
map.on('tileload', function(){ tileOk++; errs = 0; if(tileOk >= 2) hideLoad(); });
function nextSource(){
  const i = ORDER.indexOf(curName);
  if(i >= 0 && i < ORDER.length - 1) mount(ORDER[i + 1]);
}
// 「点此重试」：无论走到哪个源，都强制换（或重挂）一个源重新拉瓦片
function retryTiles(){
  document.getElementById('tileHint').style.display = 'none';
  document.getElementById('map').classList.remove('tiles-ready');
  errs = 0; tileOk = 0;
  const n = ORDER[(Math.max(ORDER.indexOf(curName), 0) + 1) % ORDER.length];
  curName = null;
  mount(n);
  document.getElementById('tileLoading').style.display = 'block';
}
document.getElementById('tileRetry').onclick = retryTiles;
map.on('tileerror', function(){
  errs++;
  if(errs >= 4){ errs = 0; nextSource(); }   // 连着取不到 → 换下一个源
});
// 放大/移动后 3.5 秒一张新瓦片都没回来（请求挂死，不报错）→ 也换源
map.on('zoomend', function(){
  const before = tileOk;
  setTimeout(function(){ if(tileOk === before) nextSource(); }, 3500);
});

// 直接锁定主源，不再并发测速：
// HTML 头部已经 preload 了 GSI 的首屏瓦片，立刻挂载才能命中这份缓存
// （等于把「下载首屏地图」提前到 HTML 解析阶段，JS 一执行就出图）。
// 而测速本身要多下 2 张图，还常常挑中「当时快、整体慢」的源，反而更慢。
mount('gsi');
// 兜底：2.5 秒一张都没出来，说明 GSI 走不通，交给 esri 接管
setTimeout(function(){ if(tileOk === 0) mount('esri'); }, 2500);
setTimeout(function(){
  if(tileOk === 0){
    const l = document.getElementById('tileLoading'); if(l) l.style.display = 'none';
    document.getElementById('tileHint').style.display = 'block';
  }
}, 9000);

const POP_OPT = {maxWidth:270, minWidth:230, autoPanPadding:[28,28], closeButton:true};
const markers = {};
const hidden = new Set();   // 被分类筛选关掉的点位（搜索不进这里，单独按关键词匹配）
let curSort = 'cat';

function badgeHTML(s){
  return `<span class="badge" style="background:${CATS[s.cat].color}">${s.id}</span>`;
}
function iconHTML(s){
  return L.divIcon({
    className:'', html:`<div style="width:30px;height:30px;border-radius:50%;background:${CATS[s.cat].color};color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid #fff;outline:1px solid rgba(15,23,42,.35)">${s.id}</div>`,
    iconSize:[30,30], iconAnchor:[15,15], popupAnchor:[0,-16]
  });
}
// 当前可见点位的顺序（受搜索/分类筛选影响），弹窗与灯箱的「上一个/下一个」都走它
function visibleSpots(){
  return SPOTS.filter(s=>!hidden.has(s.id));
}
function orderOf(id){ return visibleSpots().findIndex(s=>s.id === id); }
function popupHTML(s){
  const src = PHOTOS[s.id] || thumbSrc(s.id);
  const zoom = REAL_PHOTO.has(s.id) || !!PHOTOS[s.id];   // 只有真·实拍才能点开看大图
  const img = src
    ? (zoom
        ? `<img class="zoomable" src="${src}" data-full="${fullSrc(s.id)}" data-local="${PHOTO_DIR + s.id}.webp" alt="${s.name}" decoding="async">`
        : `<img src="${src}" alt="${s.name}" decoding="async">`)
    : `<div class="pop-img-ph">${CATS[s.cat].icon}</div>`;
  const list = visibleSpots();
  const i = list.findIndex(x=>x.id === s.id);
  const prev = i > 0 ? list[i-1] : null;
  const next = i >= 0 && i < list.length - 1 ? list[i+1] : null;
  const day = s.day ? `<div class="row"><b>行程日</b>：${s.day}</div>` : '';
  return `<div class="pop">
    ${img}
    <div class="pt">${s.name} <span class="pb" style="background:${CATS[s.cat].color}">${s.id}</span></div>
    <div class="row"><b>类型</b>：${s.type}　<b>门票/预算</b>：${s.fee}</div>
    <div class="row"><b>地址</b>：${s.addr}</div>
    <div class="row"><b>时间</b>：${s.hours}</div>
    ${day}
    <div class="hist">${s.hist}</div>
    <div class="near">📍 周边参考：${s.near}</div>
    <div class="coord" data-coord="${s.lat.toFixed(4)}, ${s.lng.toFixed(4)}">🧭 点这里复制坐标 ${s.lat.toFixed(4)}, ${s.lng.toFixed(4)}</div>
    <a class="navout" target="_blank" rel="noopener"
       href="https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}">🗺 用地图 App 导航到这里</a>
    <div class="pnav">
      <button data-go="${prev ? prev.id : ''}" ${prev ? '' : 'disabled'}>‹ ${prev ? prev.name : '已是第一个'}</button>
      <button data-go="${next ? next.id : ''}" ${next ? '' : 'disabled'}>${next ? next.name : '已是最后一个'} ›</button>
    </div>
  </div>`;
}
function copyCoord(el){
  const t = el.getAttribute('data-coord');
  const done = ()=>{ const o=el.textContent; el.textContent='✅ 已复制 '+t; setTimeout(()=>el.textContent=o,1600); };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(t).then(done).catch(fallback);
  } else fallback();
  function fallback(){
    const ta=document.createElement('textarea'); ta.value=t; ta.style.position='fixed'; ta.style.opacity='0';
    document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); done(); }catch(e){}
    document.body.removeChild(ta);
  }
}

// 弹窗打开后的统一处理：绑定复制坐标、点图看大图、上一个/下一个（缩略图已内联，无需回退）
function afterPopupOpen(s){
  const pop = document.querySelector('.pop'); if(!pop) return;
  const c = pop.querySelector('.coord'); if(c) c.onclick = ()=>copyCoord(c);
  const zi = pop.querySelector('img.zoomable');
  if(zi) zi.onclick = ()=>openLightbox(zi.dataset.full, zi.dataset.local, s.id);
  pop.querySelectorAll('.pnav button').forEach(b=>{
    const go = b.getAttribute('data-go');
    if(go) b.onclick = ()=>focusSpot(go);
  });
}
SPOTS.forEach(s=>{
  const m = L.marker([s.lat,s.lng],{icon:iconHTML(s)}).addTo(map);
  m.on('click', ()=>{ m.bindPopup(popupHTML(s), POP_OPT).openPopup(); afterPopupOpen(s); });
  markers[s.id] = m;
});

function buildPolyline(ids, color, dash){
  const pts = ids.map(id=>{const s=SPOTS.find(x=>x.id===id);return [s.lat,s.lng];});
  return L.polyline(pts,{color:color, weight:4, opacity:.85, dashArray:dash, lineJoin:'round'});
}
const tripLine = buildPolyline(TRIP_ROUTE, '#2563EB', null).addTo(map);
const retLine  = buildPolyline(RETURN_ROUTE, '#94A3B8', '8,7').addTo(map);

// ---------- 抽屉 ----------
const sidebar = document.getElementById('sidebar');
const scrim   = document.getElementById('scrim');
const isMobile = ()=> window.innerWidth <= 860;
// 缩略图已内联（thumbs.js），打开抽屉无需再下载图片
function openSide(){ sidebar.classList.add('open'); if(isMobile()) scrim.classList.add('show'); }
function closeSide(){ sidebar.classList.remove('open'); scrim.classList.remove('show'); }
document.getElementById('bMenu').onclick = openSide;
document.getElementById('side-close').onclick = closeSide;
scrim.onclick = closeSide;

function buildLegend(){
  document.getElementById('legend').innerHTML = Object.values(CATS).map(c=>
    `<span class="lg"><span class="d" style="background:${c.color}"></span>${c.icon} ${c.name}</span>`).join('');
}
function buildFilters(){
  const el = document.getElementById('filters');
  el.innerHTML = Object.entries(CATS).map(([k,c])=>
    `<span class="chip" data-cat="${k}" style="border-color:${c.color}">${c.icon} ${c.name}</span>`).join('');
  el.querySelectorAll('.chip').forEach(ch=>{
    ch.onclick=()=>{
      ch.classList.toggle('off');
      const cat=ch.dataset.cat, off=ch.classList.contains('off');
      SPOTS.filter(s=>s.cat===cat).forEach(s=>{ if(off) hidden.add(s.id); else hidden.delete(s.id); });
      applyView();
    };
  });
}
// 列表与地图标记联动：分类筛选后卡片、分组标题、地图标记、计数一起更新
function applyView(){
  const shown = [];
  const byId = {};
  SPOTS.forEach(s=>byId[s.id]=s);
  document.querySelectorAll('#list .card').forEach(card=>{
    const id = card.dataset.id, s = byId[id];
    const ok = !!s && !hidden.has(id);
    card.classList.toggle('hide', !ok);
    if(ok) shown.push(id);
    if(ok){ if(!map.hasLayer(markers[id])) markers[id].addTo(map); }
    else  { if(map.hasLayer(markers[id])) map.removeLayer(markers[id]); }
  });
  document.querySelectorAll('#list .group-title').forEach(g=>{
    const k = g.getAttribute('data-key');
    g.style.display = shown.some(id=>byId[id] && (byId[id].gk||'').split(' ').indexOf(k) >= 0) ? '' : 'none';
  });
  document.getElementById('empty').style.display = shown.length ? 'none' : 'block';
  document.getElementById('cnt').textContent  = shown.length;
  document.getElementById('cnt2').textContent = shown.length;
}
function renderList(){
  const list = document.getElementById('list');
  list.innerHTML = '';
  let groups;
  if(curSort === 'day'){
    // 按行程日分组：「2/8 · 2/15」这类跨多天的点位，在涉及的每一天都出现；
    // 「2/13–2/15」这种连续区间只归到起始日，避免同一张卡在每一天重复刷屏
    const buckets = {};
    SPOTS.forEach(s=>{
      const parts = (s.day||'').split('·').map(x=>x.trim()).filter(Boolean);
      const keys = parts.map(pt=>{
        const m = pt.match(/(\d+)\/(\d+)/);
        return m ? +m[2] : 99;
      });
      if(!keys.length) keys.push(99);
      s.gk = keys.map(k=>'d' + k).join(' ');
      keys.forEach(k=>{ (buckets[k] = buckets[k] || []).push(s); });
    });
    groups = Object.keys(buckets).map(Number).sort((a,b)=>a-b).map(k=>({
      key:'d'+k, title:(k===99 ? '🗓 未定日期' : '🗓 2/' + k), color:'#16324F', items:buckets[k]
    }));
  } else {
    groups = Object.entries(CATS).map(([k,c])=>({
      key:k, title:c.icon + ' ' + c.name, color:c.color, items:SPOTS.filter(s=>s.cat===k)
    })).filter(g=>g.items.length);
    groups.forEach(g=>g.items.forEach(s=>s.gk = g.key));
  }
  groups.forEach(g=>{
    if(!g.items.length) return;
    list.insertAdjacentHTML('beforeend',
      `<div class="group-title" data-key="${g.key}" style="color:${g.color}">${g.title}<span class="gn">${g.items.length} 处</span></div>`);
    g.items.forEach(s=>{
      const src = PHOTOS[s.id] || thumbSrc(s.id);
      const thumb = src
        ? `<div class="thumb"><img src="${src}" data-id="${s.id}" alt="" decoding="async" draggable="false"></div>`
        : `<div class="thumb"><div class="thumb-ph">${CATS[s.cat].icon}</div></div>`;
      const div = document.createElement('div');
      div.className='card';
      div.dataset.id = s.id;
      div.innerHTML = `${thumb}<div class="info">
          <div class="nm">${badgeHTML(s)} ${s.name} <span class="tt">${s.type}</span>${s.day?`<span class="dy">${s.day}</span>`:''}</div>
          <div class="meta">${s.hours}　${s.fee==='—'?'':s.fee}</div>
          <div class="hist">${s.hist}</div>
        </div>`;
      div.onclick=()=>{ focusSpot(s.id); if(isMobile()) closeSide(); };
      list.appendChild(div);
    });
  });
  applyView();
}
document.querySelectorAll('#sortbar .sbtn').forEach(b=>{
  b.onclick = ()=>{
    document.querySelectorAll('#sortbar .sbtn').forEach(x=>x.classList.remove('on'));
    b.classList.add('on');
    curSort = b.getAttribute('data-sort');
    renderList();
  };
});
function focusSpot(id){
  const s = SPOTS.find(x=>x.id===id); if(!s) return;
  if(!map.hasLayer(markers[id])) markers[id].addTo(map);
  map.flyTo([s.lat,s.lng], 14, {duration:.6});
  setTimeout(()=>{
    markers[id].bindPopup(popupHTML(s), POP_OPT).openPopup();
    afterPopupOpen(s);
  }, 620);
}

// ---------- 行程总览弹层（航班 + 酒店 + 路线时间轴）----------
const ITINERARY = [
  {d:'2/8 周一', items:[
    {icon:'✈️', t:'NH976 上海浦东T2 19:05 → 大阪关西T1 22:00（1小时55分）'},
    {icon:'🏨', t:'关西机场日航酒店（住1晚，T1直连）', spot:'OSK1'}]},
  {d:'2/9 周二', items:[
    {icon:'🚢', t:'06:20 关西T1 1F 12号巴士站 → 06:30 首班高速船 → 07:01 神户机场（31分钟）｜买往返票 3,060円（120天有效，回程用）', warn:true},
    {icon:'✈️', t:'NH577 大阪神户 08:40 → 札幌新千岁 10:30（1小时50分）'},
    {icon:'🏨', t:'札幌中岛公园普乐美雅酒店（连住2晚）', spot:'SP9'},
    {icon:'❄️', t:'下午：北海道大学 / 大通公园冰雪节'}]},
  {d:'2/10 周三', items:[
    {icon:'🚃', t:'小樽当日往返（JR快速约35分钟）'},
    {icon:'🕯️', t:'小樽运河 → 八音盒堂 → 煤油灯咖啡馆 → 天狗山夜景'}]},
  {d:'2/11 周四', items:[
    {icon:'🚃', t:'札幌 → 登别'},
    {icon:'🏨', t:'第一滝本馆（住1晚）· 泡硫磺泉', spot:'NO3'},
    {icon:'♨️', t:'傍晚地狱谷「鬼火之路」'}]},
  {d:'2/12 周五', items:[
    {icon:'🚃', t:'登别 → 洞爷'},
    {icon:'🏨', t:'洞爷湖万世阁酒店（住1晚）', spot:'TO4'},
    {icon:'🎆', t:'20:30 洞爷湖冬花火（房间湖景可看）'}]},
  {d:'2/13 周六', items:[
    {icon:'🚃', t:'洞爷 → 函馆'},
    {icon:'🏨', t:'函馆JR旅馆（连住2晚）', spot:'HA9'},
    {icon:'🌃', t:'傍晚：八幡坂 → 函馆山夜景'}]},
  {d:'2/14 周日', items:[
    {icon:'⭐', t:'函馆一日：五棱郭塔 → 金森红砖仓库 → 小丑汉堡'}]},
  {d:'2/15 周一', items:[
    {icon:'🧳', t:'退房（函馆JR旅馆直通车站）· 上午 8:00–10:30 还能逛五棱郭 / 元町 / 吃海鲜'},
    {icon:'🚃', t:'最晚 12:30 前必须从函馆上车（推荐 11:00 北斗 → 14:40 札幌 → 15:20 快速 → 16:00 新千岁）', warn:true},
    {icon:'✈️', t:'NH578 札幌新千岁 18:30 → 大阪神户 20:30（2小时）'},
    {icon:'🚢', t:'22:45 神户机场末班高速船 → 23:25 关西T1（31分钟）｜错过只能陆路约2小时或打车约2万円', warn:true},
    {icon:'🏨', t:'关西机场日航酒店（住1晚）', spot:'OSK1'}]},
  {d:'2/16 周二', items:[
    {icon:'✈️', t:'NH973 大阪关西T1 09:00 → 上海浦东T2 11:00（3小时）· 回家'}]},
];
const ovl = document.getElementById('ovl');
function buildItinerary(){
  document.getElementById('itnList').innerHTML = ITINERARY.map(day=>`
    <div class="itn-day"><div class="dt">${day.d}</div><div class="its">
      ${day.items.map(it=>`<div class="itn-it${it.spot?' spot':''}${it.warn?' warn':''}" ${it.spot?`data-spot="${it.spot}"`:''}>${it.warn?'<span class="wt">重点</span>':''}${it.icon} ${it.t}${it.spot?' <span class="go">→地图</span>':''}</div>`).join('')}
    </div></div>`).join('');
  document.querySelectorAll('.itn-it.spot').forEach(el=>{
    el.onclick = ()=>{ closeOvl(); focusSpot(el.getAttribute('data-spot')); };
  });
}
function openOvl(){ ovl.classList.add('show'); }
function closeOvl(){ ovl.classList.remove('show'); }
document.getElementById('bOvl').onclick = openOvl;
document.getElementById('bOvlM').onclick = openOvl;
document.getElementById('ovlClose').onclick = closeOvl;
ovl.onclick = (e)=>{ if(e.target === ovl) closeOvl(); };

// ---------- 大图灯箱（点弹窗配图看原图）----------
const lb = document.getElementById('lb');
const lbImg = document.getElementById('lbImg');
const lbLoad = lb.querySelector('.lb-load');
const lbCap = document.getElementById('lbCap');
let lbTimer = null, lbId = null, lbFull = false;
// 大图到位：去掉模糊、正式显示
function lbShow(url){
  clearTimeout(lbTimer);
  lbImg.classList.remove('preview');
  lbImg.setAttribute('src', url);
  lbImg.style.display = 'block';
  lbLoad.style.display = 'none';
  lbFull = true;
}
function openLightbox(src, local, id){
  if(!src) return;
  lbId = id || null; lbFull = false;
  lb.classList.add('show');
  // 先用已经内联在页面里的缩略图顶上（零网络、瞬间出画面），大图好了再无缝替换
  const th = id ? thumbSrc(id) : '';
  if(th){
    lbImg.classList.add('preview');
    lbImg.setAttribute('src', th);
    lbImg.style.display = 'block';
    lbLoad.style.display = 'none';
  } else {
    lbImg.style.display = 'none';
    lbLoad.style.display = 'block';
    lbLoad.textContent = '大图加载中…';
  }
  updateLbNav();
  const tryLoad = function(url, isLocal){
    const im = new Image();
    im.onload = function(){ lbShow(url); };
    im.onerror = function(){
      clearTimeout(lbTimer);
      if(!isLocal && local) tryLoad(local, true);      // CDN 不通就用本站
      else if(!lbFull){ lbLoad.style.display='block'; lbLoad.textContent='这张图暂时加载不出来'; }
    };
    im.src = url;
  };
  clearTimeout(lbTimer);
  lbTimer = setTimeout(function(){ if(!lbFull && local) tryLoad(local, true); }, 1500);
  tryLoad(src, !!PHOTOS[lbId]);
}
function updateLbNav(){
  const list = visibleSpots();
  const i = lbId ? list.findIndex(s=>s.id === lbId) : -1;
  document.getElementById('lbPrev').disabled = (i <= 0);
  document.getElementById('lbNext').disabled = (i < 0 || i >= list.length - 1);
  const s = i >= 0 ? list[i] : null;
  lbCap.innerHTML = s
    ? `${s.name}${s.day ? ' · ' + s.day : ''}　(${i+1}/${list.length})<span class="hint">左右滑动切换 · 下滑关闭</span>`
    : '';
}
function lbStep(d){
  const list = visibleSpots();
  const i = lbId ? list.findIndex(s=>s.id === lbId) : -1;
  const j = i + d;
  if(i < 0 || j < 0 || j >= list.length) return;
  const s = list[j];
  openLightbox(fullSrc(s.id), PHOTOS[s.id] ? '' : PHOTO_DIR + s.id + '.webp', s.id);
}
function closeLightbox(){ lb.classList.remove('show'); lbImg.removeAttribute('src'); }
let lbSwiped = false;   // 刚滑动过就别再当成「点背景关闭」
lb.onclick = function(e){
  if(lbSwiped){ lbSwiped = false; return; }
  if(!e.target.closest('.lb-nav') && !e.target.closest('.lb-x')) closeLightbox();
};
document.querySelector('#lb .lb-x').onclick = closeLightbox;
document.getElementById('lbPrev').onclick = ()=>lbStep(-1);
document.getElementById('lbNext').onclick = ()=>lbStep(1);

// ---------- 手势：让手机上的滑动更符合直觉 ----------
// dir 判定：先锁定主轴（横滑/竖滑），避免斜着划时误触发；要求「又快又远」才算数
function onSwipe(el, cb){
  let x0 = 0, y0 = 0, t0 = 0, axis = null;
  el.addEventListener('touchstart', function(e){
    if(e.touches.length !== 1){ axis = 'skip'; return; }   // 双指缩放不参与
    const t = e.touches[0]; x0 = t.clientX; y0 = t.clientY; t0 = Date.now(); axis = null;
  }, {passive:true});
  el.addEventListener('touchmove', function(e){
    if(axis !== null) return;
    const t = e.touches[0], dx = t.clientX - x0, dy = t.clientY - y0;
    if(Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
    axis = Math.abs(dy) > Math.abs(dx) * 1.2 ? 'y' : 'x';
  }, {passive:true});
  el.addEventListener('touchend', function(e){
    const ax = axis; axis = null;
    if(ax === null || ax === 'skip') return;
    const t = e.changedTouches[0] || {};
    const dx = (t.clientX || x0) - x0, dy = (t.clientY || y0) - y0;
    if(Date.now() - t0 > 600) return;
    if(Math.abs(dx) < 45 && Math.abs(dy) < 60) return;
    cb(dx, dy, ax);
  }, {passive:true});
}
let sideSwiped = false;
onSwipe(sidebar, function(dx, dy, axis){
  if(axis === 'x' && dx < 0 && isMobile()){ sideSwiped = true; closeSide(); }
});
// 滑动后紧跟的那次 click 要吃掉，否则滑一下会误触发卡片跳转
sidebar.addEventListener('click', function(e){
  if(sideSwiped){ sideSwiped = false; e.stopPropagation(); e.preventDefault(); }
}, true);
onSwipe(lb, function(dx, dy, axis){
  lbSwiped = true;
  if(axis === 'x'){ if(dx < 0) lbStep(1); else lbStep(-1); }
  else if(dy > 0) closeLightbox();          // 大图下滑关闭
});

// ---------- 控件 ----------
const bTripM = document.getElementById('bTripM');
bTripM.onclick = ()=>{
  const on = map.hasLayer(tripLine);
  if(on){ map.removeLayer(tripLine); map.removeLayer(retLine); }
  else  { tripLine.addTo(map); retLine.addTo(map); }
  bTripM.classList.toggle('on', !on);
};
// 「回到全览」：把当前可见的点位全部框进视野（筛选后只框筛选结果）
function fitAll(){
  const pts = visibleSpots();
  if(!pts.length) return;
  map.closePopup();
  map.fitBounds(L.latLngBounds(pts.map(s=>[s.lat, s.lng])), {padding:[44, 44]});
}
const FvControl = L.Control.extend({
  options:{position:'bottomright'},
  onAdd:function(){
    const c = L.DomUtil.create('div', 'leaflet-control-fullview');
    c.innerHTML = '<a href="javascript:void(0)" title="回到全览">⛶</a>';
    L.DomEvent.disableClickPropagation(c);
    c.onclick = fitAll;
    return c;
  }
});
map.addControl(new FvControl());
// 桌面端默认展开抽屉；移动端默认收起
if(!isMobile()) openSide();

buildLegend(); buildFilters(); renderList(); buildItinerary();

// ---------- 内联缩略图（thumbs.js）----------
// 地图渲染完再拉，避免和地图脚本抢带宽；加载完自动把列表里的图补上
function loadThumbs(){
  if(window.__thumbsReady) return;
  const s = document.createElement('script');
  s.src = 'thumbs.js'; s.async = true;
  s.onerror = ()=>{};
  document.head.appendChild(s);
}
window.__onThumbs = function(){
  document.querySelectorAll('#list .card[data-id]').forEach(card=>{
    const id = card.dataset.id, t = THUMBS[id];
    if(!t) return;
    const box = card.querySelector('.thumb'); if(!box) return;
    if(box.querySelector('img')) return;
    box.innerHTML = `<img src="${t}" alt="">`;
  });
};
// 不必等地图就绪：250ms 后就与瓦片并行下载，列表更早出图
setTimeout(loadThumbs, 250);
