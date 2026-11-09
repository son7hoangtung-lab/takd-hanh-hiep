// ===== DỮ LIỆU GAME: từ vựng, môn phái, quái, đồ, nhiệm vụ, hội thoại =====
window.G = window.G || {};

// --- Từ vựng: hanzi|pinyin|Hán Việt|nghĩa|chủ đề ---
// Chủ đề: co (cơ bản), so (số & thời gian), gd (gia đình & người), an (ăn uống), di (nơi chốn & đi lại),
// hd (hoạt động), gh (giang hồ – từ trong game), bh (bảo hiểm – phần đặc biệt)
G.VOCAB_RAW = `
你|nǐ|nễ|bạn, anh, chị|co
我|wǒ|ngã|tôi|co
他|tā|tha|anh ấy|co
她|tā|tha|cô ấy|co
我们|wǒmen|ngã môn|chúng tôi|co
好|hǎo|hảo|tốt, khỏe|co
是|shì|thị|là|co
不|bù|bất|không|co
很|hěn|ngận|rất|co
太|tài|thái|quá|co
大|dà|đại|to, lớn|co
小|xiǎo|tiểu|nhỏ|co
多|duō|đa|nhiều|co
少|shǎo|thiểu|ít|co
有|yǒu|hữu|có|co
没有|méiyǒu|một hữu|không có|co
这|zhè|giá|này|co
那|nà|na|kia, đó|co
哪|nǎ|ná|nào|co
谁|shéi|thùy|ai|co
什么|shénme|thập ma|cái gì|co
怎么|zěnme|chẩm ma|thế nào, sao|co
怎么样|zěnmeyàng|chẩm ma dạng|ra sao|co
几|jǐ|kỉ|mấy|co
多少|duōshao|đa thiểu|bao nhiêu|co
吗|ma|ma|không? (trợ từ hỏi)|co
呢|ne|ni|còn…thì sao? (trợ từ)|co
的|de|đích|của (trợ từ)|co
了|le|liễu|rồi (trợ từ)|co
都|dōu|đô|đều|co
和|hé|hòa|và|co
在|zài|tại|ở, đang|co
会|huì|hội|biết, sẽ|co
能|néng|năng|có thể|co
想|xiǎng|tưởng|muốn, nghĩ|co
爱|ài|ái|yêu|co
喜欢|xǐhuan|hỉ hoan|thích|co
谢谢|xièxie|tạ tạ|cảm ơn|co
不客气|bú kèqi|bất khách khí|đừng khách sáo|co
对不起|duìbuqǐ|đối bất khởi|xin lỗi|co
没关系|méi guānxi|một quan hệ|không sao|co
再见|zàijiàn|tái kiến|tạm biệt|co
请|qǐng|thỉnh|mời, xin|co
喂|wèi|uy|alô, này|co
高兴|gāoxìng|cao hứng|vui vẻ|co
漂亮|piàoliang|phiêu lượng|xinh đẹp|co
冷|lěng|lãnh|lạnh|co
热|rè|nhiệt|nóng|co
叫|jiào|khiếu|gọi, tên là|co
名字|míngzi|danh tự|tên|co
认识|rènshi|nhận thức|quen biết|co
一|yī|nhất|một|so
二|èr|nhị|hai|so
三|sān|tam|ba|so
四|sì|tứ|bốn|so
五|wǔ|ngũ|năm|so
六|liù|lục|sáu|so
七|qī|thất|bảy|so
八|bā|bát|tám|so
九|jiǔ|cửu|chín|so
十|shí|thập|mười|so
个|gè|cá|cái (lượng từ)|so
本|běn|bản|quyển (lượng từ)|so
些|xiē|ta|một vài|so
块|kuài|khối|đồng (tiền)|so
钱|qián|tiền|tiền|so
点|diǎn|điểm|giờ, điểm|so
分钟|fēnzhōng|phân chung|phút|so
年|nián|niên|năm|so
月|yuè|nguyệt|tháng, trăng|so
号|hào|hiệu|ngày (trong tháng), số|so
星期|xīngqī|tinh kỳ|tuần, thứ|so
岁|suì|tuế|tuổi|so
今天|jīntiān|kim thiên|hôm nay|so
明天|míngtiān|minh thiên|ngày mai|so
昨天|zuótiān|tạc thiên|hôm qua|so
现在|xiànzài|hiện tại|bây giờ|so
上午|shàngwǔ|thượng ngọ|buổi sáng|so
中午|zhōngwǔ|trung ngọ|buổi trưa|so
下午|xiàwǔ|hạ ngọ|buổi chiều|so
时候|shíhou|thời hậu|lúc, khi|so
天气|tiānqì|thiên khí|thời tiết|so
下雨|xià yǔ|hạ vũ|trời mưa|so
人|rén|nhân|người|gd
爸爸|bàba|bá bá|bố|gd
妈妈|māma|ma ma|mẹ|gd
儿子|érzi|nhi tử|con trai|gd
女儿|nǚ'ér|nữ nhi|con gái|gd
朋友|péngyou|bằng hữu|bạn bè|gd
同学|tóngxué|đồng học|bạn học|gd
老师|lǎoshī|lão sư|thầy giáo|gd
学生|xuésheng|học sinh|học sinh|gd
先生|xiānsheng|tiên sinh|ông, ngài|gd
小姐|xiǎojiě|tiểu thư|cô (gái trẻ)|gd
医生|yīshēng|y sinh|bác sĩ|gd
家|jiā|gia|nhà, gia đình|gd
狗|gǒu|cẩu|con chó|gd
猫|māo|miêu|con mèo|gd
吃|chī|ngật|ăn|an
喝|hē|hát|uống|an
茶|chá|trà|trà|an
水|shuǐ|thủy|nước|an
菜|cài|thái|món ăn, rau|an
米饭|mǐfàn|mễ phạn|cơm|an
水果|shuǐguǒ|thủy quả|hoa quả|an
苹果|píngguǒ|bình quả|quả táo|an
杯子|bēizi|bôi tử|cái cốc|an
饭店|fàndiàn|phạn điếm|nhà hàng, quán ăn|an
中国|Zhōngguó|Trung Quốc|Trung Quốc|di
北京|Běijīng|Bắc Kinh|Bắc Kinh|di
汉语|Hànyǔ|Hán ngữ|tiếng Hán|di
学校|xuéxiào|học hiệu|trường học|di
医院|yīyuàn|y viện|bệnh viện|di
商店|shāngdiàn|thương điếm|cửa hàng|di
上|shàng|thượng|trên|di
下|xià|hạ|dưới|di
里|lǐ|lí|bên trong|di
前面|qiánmiàn|tiền diện|phía trước|di
后面|hòumiàn|hậu diện|phía sau|di
出租车|chūzūchē|xuất tô xa|xe taxi|di
飞机|fēijī|phi cơ|máy bay|di
桌子|zhuōzi|trác tử|cái bàn|di
椅子|yǐzi|ỷ tử|cái ghế|di
衣服|yīfu|y phục|quần áo|di
东西|dōngxi|đông tây|đồ vật|di
电脑|diànnǎo|điện não|máy tính|di
电视|diànshì|điện thị|ti vi|di
电影|diànyǐng|điện ảnh|phim|di
书|shū|thư|sách|di
字|zì|tự|chữ|di
来|lái|lai|đến|hd
去|qù|khứ|đi|hd
回|huí|hồi|về|hd
看|kàn|khán|xem, nhìn|hd
看见|kànjiàn|khán kiến|nhìn thấy|hd
听|tīng|thính|nghe|hd
说|shuō|thuyết|nói|hd
读|dú|độc|đọc|hd
写|xiě|tả|viết|hd
学习|xuéxí|học tập|học|hd
工作|gōngzuò|công tác|làm việc|hd
买|mǎi|mãi|mua|hd
开|kāi|khai|mở, lái|hd
坐|zuò|tọa|ngồi|hd
做|zuò|tố|làm|hd
住|zhù|trú|sống, ở|hd
睡觉|shuìjiào|thụy giác|ngủ|hd
打电话|dǎ diànhuà|đả điện thoại|gọi điện thoại|hd
马|mǎ|mã|ngựa|gh
鱼|yú|ngư|cá|gh
船|chuán|thuyền|thuyền|gh
海|hǎi|hải|biển|gh
山|shān|sơn|núi|gh
河|hé|hà|sông|gh
刀|dāo|đao|đao|gh
剑|jiàn|kiếm|kiếm|gh
锤|chuí|chùy|chùy|gh
打|dǎ|đả|đánh|gh
拳|quán|quyền|nắm đấm, quyền|gh
门|mén|môn|cửa, môn phái|gh
龙|lóng|long|rồng|gh
虎|hǔ|hổ|hổ|gh
王|wáng|vương|vua|gh
宝|bǎo|bảo|quý báu|gh
火|huǒ|hỏa|lửa|gh
风|fēng|phong|gió|gh
雷|léi|lôi|sấm|gh
力|lì|lực|sức mạnh|gh
保险|bǎoxiǎn|bảo hiểm|bảo hiểm|bh
风险|fēngxiǎn|phong hiểm|rủi ro|bh
损失|sǔnshī|tổn thất|tổn thất, thiệt hại|bh
赔偿|péicháng|bồi thường|bồi thường|bh
火灾|huǒzāi|hỏa tai|hỏa hoạn|bh
合同|hétong|hợp đồng|hợp đồng|bh
保费|bǎofèi|bảo phí|phí bảo hiểm|bh
货物|huòwù|hóa vật|hàng hóa|bh
船舶|chuánbó|thuyền bạc|tàu thuyền|bh
理赔|lǐpéi|lý bồi|giải quyết bồi thường|bh
`;
G.TOPICS = {
  co:{vi:'Cơ bản',zh:'基础'}, so:{vi:'Số & thời gian',zh:'数字时间'}, gd:{vi:'Người & gia đình',zh:'人与家'},
  an:{vi:'Ăn uống',zh:'饮食'}, di:{vi:'Nơi chốn & đồ vật',zh:'地方东西'}, hd:{vi:'Hoạt động',zh:'动作'},
  gh:{vi:'Giang hồ',zh:'江湖'}, bh:{vi:'Bảo hiểm',zh:'保险'}
};
G.VOCAB = G.VOCAB_RAW.trim().split('\n').map((l,i)=>{const p=l.split('|');return {id:i,zh:p[0],py:p[1],hv:p[2],vi:p[3],t:p[4]};});

// --- Môn phái (ngũ hành tương khắc) ---
G.SECTS = [
  {id:'muay', zh:'越拳门', vi:'Muay Việt', el:'Kim', col:'#d9a441', desc:'Quyền cước + chùy trận, đánh trên lưng ngựa'},
  {id:'thienloi', zh:'天雷剑派', vi:'Thiên Lôi Kiếm Phái', el:'Mộc', col:'#7fc8ff', desc:'Kiếm & sấm sét'},
  {id:'huyenbang', zh:'玄冰宫', vi:'Huyền Băng Cung', el:'Thủy', col:'#a8e6ff', desc:'Băng chưởng, làm chậm'},
  {id:'xichdiem', zh:'赤焰教', vi:'Xích Diễm Giáo', el:'Hỏa', col:'#ff6a3d', desc:'Hỏa công đánh lan'},
  {id:'phonganh', zh:'风影阁', vi:'Phong Ảnh Các', el:'Mộc', col:'#9be37a', desc:'Thích khách, ám khí'},
  {id:'bichhai', zh:'碧海帮', vi:'Bích Hải Bang', el:'Thủy', col:'#3cc7b0', desc:'Thủy chiến'},
  {id:'kimcuong', zh:'金刚寺', vi:'Kim Cương Tự', el:'Thổ', col:'#f2d27a', desc:'Phật môn, hộ thân'},
  {id:'bachdoc', zh:'百毒谷', vi:'Bách Độc Cốc', el:'Mộc', col:'#b46cff', desc:'Dùng độc'},
  {id:'thuonglang', zh:'苍狼部', vi:'Thương Lang Bộ', el:'Thổ', col:'#c9b08a', desc:'Cung kỵ thảo nguyên'}
];

// --- Chiêu thức Muay Việt ---
G.SKILLS = [
  {id:'thietquyen', zh:'铁拳', vi:'Thiết Quyền', lv:1, cd:3, mp:6, kind:'strike', mult:2.0, range:34, col:'#ffd27a', desc:'Đấm thẳng, sát thương đơn'},
  {id:'toanphong', zh:'旋风腿', vi:'Toàn Phong Thối', lv:3, cd:6, mp:12, kind:'spin', mult:1.6, range:52, col:'#bfe8ff', desc:'Đá xoáy quanh thân'},
  {id:'loichuy', zh:'雷锤', vi:'Lôi Chùy', lv:6, cd:8, mp:18, kind:'cone', mult:2.6, range:80, col:'#9fd0ff', desc:'Đập chùy gọi sấm phía trước'},
  {id:'kimcuong', zh:'金刚体', vi:'Kim Cương Thể', lv:10, cd:20, mp:25, kind:'buff', mult:0, range:0, col:'#ffe08a', desc:'Giáp vàng: giảm sát thương, hồi máu'},
  {id:'manhtuong', zh:'猛象冲', vi:'Mãnh Tượng Xung', lv:15, cd:10, mp:20, kind:'dash', mult:2.2, range:120, col:'#ffb36b', desc:'Thúc ngựa húc thẳng'},
  {id:'viethon', zh:'越魂破', vi:'Việt Hồn Phá', lv:20, cd:30, mp:45, kind:'nova', mult:5.0, range:130, col:'#ff5d5d', desc:'Tuyệt kỹ: hồn Việt bùng nổ'}
];

// --- Độ hiếm 8 bậc ---
G.RARITY = [
  {zh:'凡',vi:'Phàm',col:'#b8b2a7',w:420,mul:1.0},
  {zh:'精',vi:'Tinh',col:'#7ed37a',w:260,mul:1.25},
  {zh:'稀',vi:'Hiếm',col:'#5aa8ff',w:160,mul:1.6},
  {zh:'宝',vi:'Bảo',col:'#b77bff',w:90,mul:2.1},
  {zh:'传说',vi:'Truyền Thuyết',col:'#ff9a3c',w:45,mul:2.8},
  {zh:'神',vi:'Thần',col:'#ff4d4d',w:18,mul:3.7},
  {zh:'天',vi:'Thiên',col:'#ffd84a',w:6,mul:5.0},
  {zh:'至尊',vi:'Chí Tôn',col:'rainbow',w:1,mul:7.0}
];
G.SLOTS = [
  {id:'weapon',zh:'锤',vi:'Chùy',st:{atk:10}},
  {id:'helm',zh:'盔',vi:'Mũ trụ',st:{def:3,hp:20}},
  {id:'armor',zh:'甲',vi:'Giáp bào',st:{def:6,hp:40}},
  {id:'belt',zh:'带',vi:'Đai lưng',st:{hp:30,def:2}},
  {id:'boots',zh:'靴',vi:'Ủng',st:{def:2,spd:4}},
  {id:'ring',zh:'戒',vi:'Nhẫn',st:{atk:4,crit:2}},
  {id:'amulet',zh:'佩',vi:'Ngọc bội',st:{hp:25,mp:15,crit:1}}
];
G.MATERIALS = [
  {zh:'青铜',vi:'Thanh Đồng'},{zh:'玄铁',vi:'Huyền Thiết'},{zh:'赤金',vi:'Xích Kim'},{zh:'寒玉',vi:'Hàn Ngọc'},
  {zh:'龙纹',vi:'Long Văn'},{zh:'雷霆',vi:'Lôi Đình'},{zh:'莲华',vi:'Liên Hoa'},{zh:'鸿雁',vi:'Hồng Nhạn'}
];
// tỉ lệ cường hóa +1 … +12
G.ENH_RATE = [1,1,1,.95,.9,.8,.7,.55,.45,.35,.25,.15];

// --- Quái vật: base theo vùng ---
G.MOB_BASE = {
  kimlien:[
    {id:'chuot',zh:'田鼠',vi:'Chuột đồng',art:'rat',hp:30,atk:5,spd:42,lv:1,exp:8,drop:'thit'},
    {id:'ran',zh:'水蛇',vi:'Rắn nước',art:'snake',hp:45,atk:8,spd:36,lv:2,exp:12},
    {id:'cho',zh:'野狗',vi:'Chó hoang',art:'dog',hp:70,atk:11,spd:55,lv:4,exp:18,drop:'thit'},
    {id:'sontac',zh:'山贼',vi:'Sơn tặc',art:'bandit',hp:110,atk:15,spd:44,lv:6,exp:28}
  ],
  thanglong:[
    {id:'soi',zh:'野狼',vi:'Sói hoang',art:'dog',tint:'#7d7f86',hp:180,atk:22,spd:60,lv:9,exp:40,drop:'thit'},
    {id:'thichkhach',zh:'黑衣刺客',vi:'Thích khách áo đen',art:'bandit',tint:'#2a2a33',hp:230,atk:30,spd:58,lv:12,exp:55},
    {id:'ho',zh:'猛虎',vi:'Mãnh hổ',art:'tiger',hp:340,atk:38,spd:50,lv:14,exp:75,drop:'thit'},
    {id:'tuongda',zh:'石像',vi:'Tượng đá',art:'golem',hp:520,atk:42,spd:28,lv:16,exp:95}
  ],
  vandon:[
    {id:'cua',zh:'大螃蟹',vi:'Cua khổng lồ',art:'crab',hp:480,atk:48,spd:34,lv:19,exp:110},
    {id:'haitac',zh:'海盗',vi:'Hải tặc',art:'bandit',tint:'#7a2f2f',hp:620,atk:58,spd:50,lv:22,exp:140},
    {id:'thuyquy',zh:'水鬼',vi:'Thủy quỷ',art:'ghost',hp:700,atk:64,spd:46,lv:24,exp:165,water:true},
    {id:'camap',zh:'鲨鱼',vi:'Cá mập',art:'shark',hp:900,atk:72,spd:62,lv:26,exp:200,water:true}
  ]
};
G.MOB_TIER = [
  {zh:'',vi:'',m:1,col:null},
  {zh:'凶',vi:'Hung',m:1.4,col:'#ffb0a0'},
  {zh:'狂',vi:'Cuồng',m:1.9,col:'#ff7b7b'},
  {zh:'精英',vi:'Tinh anh',m:2.8,col:'#b9a3ff'},
  {zh:'首领',vi:'Thủ lĩnh',m:4.2,col:'#ffd84a'}
];
G.BOSSES = {
  kimlien:{id:'b1',zh:'莲池水妖',vi:'Liên Trì Thủy Yêu',art:'lotusdemon',hp:1500,atk:24,spd:30,lv:8,exp:400,unlock:'thanglong'},
  thanglong:{id:'b2',zh:'黑风寨主',vi:'Hắc Phong Trại Chủ',art:'warlord',hp:6000,atk:62,spd:44,lv:18,exp:1500,unlock:'vandon'},
  vandon:{id:'b3',zh:'赤须海盗王',vi:'Xích Tu Hải Tặc Vương',art:'warlord',tint:'#9a2222',hp:16000,atk:110,spd:48,lv:28,exp:4000,unlock:null}
};
G.WORLD_BOSS = {id:'wb',zh:'蛟龙',vi:'Giao Long (Thuồng luồng sông Hồng)',art:'serpent',hp:30000,atk:70,spd:40,lv:25,exp:6000,hours:[12,20]};

// --- Cá & món ăn ---
G.FISH = {
  kimlien:[{zh:'鲤鱼',vi:'Cá chép',p:5},{zh:'鲫鱼',vi:'Cá diếc',p:3},{zh:'泥鳅',vi:'Cá chạch',p:4},{zh:'金鲤',vi:'Cá chép vàng',p:40,rare:1}],
  thanglong:[{zh:'草鱼',vi:'Cá trắm',p:8},{zh:'鲶鱼',vi:'Cá trê',p:7},{zh:'黄鳝',vi:'Lươn',p:9},{zh:'龙鱼',vi:'Cá rồng',p:80,rare:1}],
  vandon:[{zh:'鲳鱼',vi:'Cá chim',p:14},{zh:'墨鱼',vi:'Mực',p:16},{zh:'龙虾',vi:'Tôm hùm',p:35},{zh:'石斑鱼',vi:'Cá mú',p:28},{zh:'海龟',vi:'Đồi mồi (thả lại)',p:0,rare:1},{zh:'金枪鱼',vi:'Cá ngừ',p:60,rare:1}]
};
G.RECIPES = [
  {id:'kaoyu',zh:'烤鱼',vi:'Cá nướng',need:{fish:1},heal:.35,desc:'Hồi 35% máu'},
  {id:'mifan',zh:'米饭',vi:'Cơm trắng',need:{gao:1},heal:.2,mp:.3,desc:'Hồi 20% máu, 30% nội lực'},
  {id:'yutang',zh:'鱼汤',vi:'Canh cá',need:{fish:2,rau:1},heal:.6,desc:'Hồi 60% máu'},
  {id:'zongzi',zh:'粽子',vi:'Bánh chưng',need:{gao:2,thit:1},heal:1,buff:'atk',desc:'Hồi đầy máu, +20% công 3 phút'}
];
G.INGR = {gao:{zh:'米',vi:'Gạo'},rau:{zh:'菜',vi:'Rau'},thit:{zh:'肉',vi:'Thịt'}};

// --- Bản đồ / vùng ---
G.REGIONS = {
  kimlien:{zh:'金莲村',vi:'Làng Kim Liên',sub:'Thăng Long ngoại thành · năm 1010',music:'village'},
  thanglong:{zh:'升龙城',vi:'Kinh thành Thăng Long',sub:'Văn Miếu · Chùa Một Cột · sông Hồng',music:'city'},
  vandon:{zh:'云屯港',vi:'Thương cảng Vân Đồn',sub:'Cửa biển Đông · bến thuyền buôn',music:'sea'}
};

// --- Tên người chơi ảo ---
G.BOT_NAMES = ['孤狼','夜雨','Kiếm Khách','小龙女','Hắc Long','醉侠','Tiểu Phong','白马','Lãng Tử','铁手','Thủy Tiên','云中鹤','Bá Đao','Mèo Mun','剑心','Đông Phong','雪儿','Trâu Vàng','神龙','Hổ Báo','月影','Vô Danh','阿飞','Gà Rán','红莲','Chiến Thần','疾风','Rồng Lửa','花无缺','Lão Ngư','霸王','Bóng Đêm','李逍遥','Cò Trắng','飞燕','Sấm Sét','狂刀','Thiên Hạ','青衣','Rùa Thần','紫电','Ngự Phong','追风','Hạc Vàng','冷月','Chim Lạc','天涯','Sen Hồng','断魂','Tôm Hùm'];
G.BOT_SUFFIX = ['','','','99','VN','_pro','123','88','x','乂'];

// --- Chat kênh thế giới (tiếng Trung + phụ đề) ---
G.CHAT_LINES = [
  ['你好！','Xin chào!'],['大家好！','Chào mọi người!'],['有人去打boss吗？','Có ai đi đánh boss không?'],
  ['我是新人，请多关照。','Tôi là người mới, mong được giúp đỡ.'],['今天天气很好。','Hôm nay thời tiết rất đẹp.'],
  ['谁有好刀？我想买。','Ai có đao tốt? Tôi muốn mua.'],['我们一起去吧！','Chúng ta cùng đi nhé!'],
  ['谢谢你！','Cảm ơn bạn!'],['不客气。','Đừng khách sáo.'],['我的马很快。','Ngựa của tôi rất nhanh.'],
  ['这个鱼很大！','Con cá này rất to!'],['现在几点？','Bây giờ mấy giờ?'],['我想去中国。','Tôi muốn đi Trung Quốc.'],
  ['你是哪个门派的？','Bạn thuộc môn phái nào?'],['对不起，我打错了。','Xin lỗi, tôi đánh nhầm.'],['没关系！','Không sao!'],
  ['明天见！','Mai gặp lại!'],['我去睡觉了，再见。','Tôi đi ngủ đây, tạm biệt.'],['海盗太多了！','Hải tặc nhiều quá!'],
  ['我喜欢吃粽子。','Tôi thích ăn bánh chưng.'],['老师说要多学习。','Thầy nói phải học nhiều.'],['谁会写这个字？','Ai biết viết chữ này?'],
  ['我的锤子加十了！','Chùy của tôi lên +10 rồi!'],['加十二太难了……','+12 khó quá…'],['蛟龙来了！快去！','Giao Long đến rồi! Đi mau!'],
  ['我没有钱了。','Tôi hết tiền rồi.'],['你们喝茶吗？','Các bạn uống trà không?'],['我在升龙城。','Tôi đang ở thành Thăng Long.']
];
G.PK_LINES = [['你的钱是我的了！','Tiền của ngươi là của ta!'],['站住！','Đứng lại!'],['你太小了，哈哈！','Ngươi yếu quá, ha ha!'],['打你！','Đánh ngươi đây!']];
G.PK_LOSE = [['我错了，对不起！','Ta sai rồi, xin lỗi!'],['你很厉害……','Ngươi giỏi thật…'],['我会回来的！','Ta sẽ quay lại!']];

// --- NPC ---
G.NPCS = {
  kimlien:[
    {id:'lytruong',zh:'里长',vi:'Lý trưởng',art:'elder',x:40,y:27},
    {id:'trangba',zh:'茶婆',vi:'Bà hàng nước',art:'woman',x:46,y:32,shop:'tea'},
    {id:'thoren',zh:'铁匠',vi:'Thợ rèn',art:'smith',x:34,y:30,role:'enhance'},
    {id:'ngung',zh:'渔翁',vi:'Ông lão đánh cá',art:'fisher',x:42,y:44},
    {id:'thaydo',zh:'私塾先生',vi:'Thầy đồ',art:'scholar',x:36,y:23,role:'study'}
  ],
  thanglong:[
    {id:'quanvo',zh:'武官',vi:'Quan võ',art:'officer',x:38,y:47},
    {id:'tiensi',zh:'进士',vi:'Ông Tiến sĩ',art:'scholar',x:22,y:24,role:'study'},
    {id:'thoren2',zh:'铁匠',vi:'Lò rèn kinh thành',art:'smith',x:48,y:36,role:'enhance'},
    {id:'thuongnhan',zh:'商人',vi:'Thương nhân',art:'merchant',x:44,y:33,shop:'city'},
    {id:'sukhong',zh:'和尚',vi:'Sư trụ trì',art:'monk',x:28,y:35}
  ],
  vandon:[
    {id:'cangchu',zh:'港主',vi:'Cảng chủ',art:'officer',x:16,y:28},
    {id:'thuongthuyen',zh:'船商',vi:'Chủ thuyền buôn',art:'merchant',x:27,y:28,shop:'port'},
    {id:'baohiem',zh:'保商',vi:'Nhà bảo hộ hàng hóa',art:'scholar',x:14,y:22},
    {id:'thoren3',zh:'铁匠',vi:'Thợ rèn bến cảng',art:'smith',x:10,y:30,role:'enhance'}
  ]
};

// --- Nhiệm vụ chính (type: talk, kill, boss, fish, cook, learn, write, speak, goto, sail, enhance, pk) ---
// d = hội thoại khi nhận: [zh, pinyin, vi]
G.MAIN_QUESTS = [
  {id:'q1',npc:'lytruong',type:'talk',title:'Trưởng môn về làng',d:[['你好！你叫什么名字？','Nǐ hǎo! Nǐ jiào shénme míngzi?','Chào! Ngài tên là gì?'],['啊，你是越拳门的掌门！','À, ngài là chưởng môn Muay Việt!','À, ngài là chưởng môn Muay Việt!']],reward:{exp:30,bac:50}},
  {id:'q2',npc:'lytruong',type:'kill',mob:'chuot',n:5,title:'Chuột phá lúa',d:[['田里有很多老鼠。','Tián lǐ yǒu hěn duō lǎoshǔ.','Ngoài đồng có rất nhiều chuột.'],['请你打五只！','Qǐng nǐ dǎ wǔ zhī!','Xin ngài đánh năm con!']],reward:{exp:60,bac:80,item:1}},
  {id:'q3',npc:'thaydo',type:'learn',n:5,title:'Học chữ với thầy đồ',d:[['学习很重要。','Xuéxí hěn zhòngyào.','Học tập rất quan trọng.'],['你会写汉字吗？先学五个字。','Nǐ huì xiě Hànzì ma? Xiān xué wǔ gè zì.','Ngài biết viết chữ Hán không? Học trước năm chữ.']],reward:{exp:60,stone:3}},
  {id:'q4',npc:'thoren',type:'enhance',n:1,title:'Rèn chùy',d:[['你的锤子太小了！','Nǐ de chuízi tài xiǎo le!','Chùy của ngài nhỏ quá!'],['给我玄晶，我帮你强化。','Gěi wǒ xuánjīng, wǒ bāng nǐ qiánghuà.','Đưa tôi huyền tinh, tôi cường hóa cho.']],reward:{exp:50,bac:60}},
  {id:'q5',npc:'trangba',type:'kill',mob:'ran',n:6,title:'Rắn ở hồ sen',d:[['我很怕蛇！','Wǒ hěn pà shé!','Tôi rất sợ rắn!'],['莲花池里有蛇。','Liánhuā chí lǐ yǒu shé.','Trong hồ sen có rắn.']],reward:{exp:90,bac:90,item:1}},
  {id:'q6',npc:'ngung',type:'fish',n:3,title:'Câu cá với ông lão',d:[['你喜欢吃鱼吗？','Nǐ xǐhuan chī yú ma?','Ngài thích ăn cá không?'],['我们去钓三条鱼吧。','Wǒmen qù diào sān tiáo yú ba.','Chúng ta đi câu ba con cá nhé.']],reward:{exp:80,bac:50,ingr:{gao:2}}},
  {id:'q7',npc:'ngung',type:'cook',n:1,title:'Bữa cơm đầu tiên',d:[['你饿了吗？','Nǐ è le ma?','Ngài đói chưa?'],['用鱼做菜吧！','Yòng yú zuò cài ba!','Lấy cá nấu món đi!']],reward:{exp:60,ingr:{thit:1,gao:2}}},
  {id:'q8',npc:'thaydo',type:'write',n:3,title:'Luyện viết ba chữ',d:[['写字要慢慢写。','Xiě zì yào mànmàn xiě.','Viết chữ phải viết từ từ.'],['请写三个字。','Qǐng xiě sān gè zì.','Xin hãy viết ba chữ.']],reward:{exp:90,stone:4}},
  {id:'q9',npc:'lytruong',type:'kill',mob:'cho',n:6,title:'Chó hoang rừng tre',d:[['竹林里有野狗。','Zhúlín lǐ yǒu yěgǒu.','Trong rừng tre có chó hoang.'],['它们很大，很多！','Tāmen hěn dà, hěn duō!','Chúng rất to, rất nhiều!']],reward:{exp:140,bac:120,item:2}},
  {id:'q10',npc:'thaydo',type:'speak',n:3,title:'Luyện nói',d:[['你会说汉语吗？','Nǐ huì shuō Hànyǔ ma?','Ngài biết nói tiếng Hán không?'],['请说三句。','Qǐng shuō sān jù.','Xin hãy nói ba câu.']],reward:{exp:100,stone:4}},
  {id:'q11',npc:'lytruong',type:'kill',mob:'sontac',n:8,title:'Dẹp sơn tặc',d:[['山贼来了！他们要我们的钱。','Shānzéi lái le! Tāmen yào wǒmen de qián.','Sơn tặc đến rồi! Chúng muốn tiền của chúng ta.'],['掌门，请你帮我们！','Zhǎngmén, qǐng nǐ bāng wǒmen!','Chưởng môn, xin giúp chúng tôi!']],reward:{exp:220,bac:200,item:2}},
  {id:'q12',npc:'lytruong',type:'boss',boss:'kimlien',title:'Thủy Yêu hồ sen',d:[['莲池里有一个水妖！','Liánchí lǐ yǒu yí gè shuǐyāo!','Trong hồ sen có một con thủy yêu!'],['打败它，你就能去升龙城。','Dǎbài tā, nǐ jiù néng qù Shēnglóng chéng.','Đánh bại nó, ngài có thể đi thành Thăng Long.']],reward:{exp:400,bac:400,item:3}},
  {id:'q13',npc:'quanvo',type:'talk',title:'Vào kinh thành',d:[['欢迎来升龙城！','Huānyíng lái Shēnglóng chéng!','Chào mừng đến thành Thăng Long!'],['皇上很喜欢学习的人。','Huángshang hěn xǐhuan xuéxí de rén.','Hoàng thượng rất quý người ham học.']],reward:{exp:150,bac:150}},
  {id:'q14',npc:'tiensi',type:'learn',n:15,title:'Văn Miếu khai bút',d:[['这是文庙。','Zhè shì Wénmiào.','Đây là Văn Miếu.'],['学十五个字，我给你宝贝。','Xué shíwǔ gè zì, wǒ gěi nǐ bǎobèi.','Học mười lăm chữ, ta tặng ngài bảo vật.']],reward:{exp:300,stone:8,item:3}},
  {id:'q15',npc:'quanvo',type:'kill',mob:'soi',n:10,title:'Sói ngoài thành',d:[['城外有很多狼。','Chéng wài yǒu hěn duō láng.','Ngoài thành có rất nhiều sói.']],reward:{exp:350,bac:300,item:2}},
  {id:'q16',npc:'sukhong',type:'kill',mob:'thichkhach',n:8,title:'Thích khách đêm',d:[['晚上有黑衣人来寺里。','Wǎnshang yǒu hēiyī rén lái sì lǐ.','Buổi tối có người áo đen đến chùa.']],reward:{exp:420,bac:320,item:3}},
  {id:'q17',npc:'quanvo',type:'pk',n:1,title:'Trừng trị kẻ PK',d:[['有人在路上打人！','Yǒu rén zài lù shang dǎ rén!','Có kẻ đánh người trên đường!'],['你去看看。','Nǐ qù kànkan.','Ngài đi xem thử.']],reward:{exp:300,bac:300}},
  {id:'q18',npc:'quanvo',type:'kill',mob:'ho',n:6,title:'Hổ dữ',d:[['山上的老虎很大！','Shān shang de lǎohǔ hěn dà!','Hổ trên núi rất to!']],reward:{exp:520,bac:400,item:3}},
  {id:'q19',npc:'quanvo',type:'boss',boss:'thanglong',title:'Hắc Phong Trại',d:[['黑风寨主很厉害。','Hēifēng zhàizhǔ hěn lìhai.','Trại chủ Hắc Phong rất lợi hại.'],['打败他，你就可以去云屯港。','Dǎbài tā, nǐ jiù kěyǐ qù Yúntún gǎng.','Đánh bại hắn, ngài có thể đi cảng Vân Đồn.']],reward:{exp:1200,bac:1000,item:4}},
  {id:'q20',npc:'cangchu',type:'talk',title:'Cửa biển Vân Đồn',d:[['这里是云屯港，有很多船。','Zhèlǐ shì Yúntún gǎng, yǒu hěn duō chuán.','Đây là cảng Vân Đồn, có rất nhiều thuyền.']],reward:{exp:400,bac:400}},
  {id:'q21',npc:'baohiem',type:'learn',topic:'bh',n:6,title:'Bảo hộ hàng hóa',d:[['船上的货物有风险。','Chuán shang de huòwù yǒu fēngxiǎn.','Hàng hóa trên thuyền có rủi ro.'],['学这些字，你就懂保险了。','Xué zhèxiē zì, nǐ jiù dǒng bǎoxiǎn le.','Học mấy chữ này, ngài sẽ hiểu bảo hiểm.']],reward:{exp:600,stone:10,item:4}},
  {id:'q22',npc:'thuongthuyen',type:'sail',title:'Ra khơi',d:[['你会开船吗？','Nǐ huì kāi chuán ma?','Ngài biết lái thuyền không?'],['坐我的船去海上看看！','Zuò wǒ de chuán qù hǎi shang kànkan!','Ngồi thuyền tôi ra biển xem!']],reward:{exp:500,bac:500}},
  {id:'q23',npc:'cangchu',type:'kill',mob:'haitac',n:10,title:'Hải tặc quấy cảng',d:[['海盗太多了！','Hǎidào tài duō le!','Hải tặc nhiều quá!']],reward:{exp:900,bac:800,item:4}},
  {id:'q24',npc:'cangchu',type:'boss',boss:'vandon',title:'Xích Tu Hải Tặc Vương',d:[['海盗王住在东边的岛上。','Hǎidào wáng zhù zài dōngbian de dǎo shang.','Hải tặc vương sống trên đảo phía đông.'],['掌门，去吧！','Zhǎngmén, qù ba!','Chưởng môn, đi đi!']],reward:{exp:4000,bac:3000,item:5}},
  {id:'q25',npc:'cangchu',type:'talk',title:'Hẹn ngày sang đất Tống',d:[['北边是大宋。','Běibian shì Dà Sòng.','Phía bắc là nước Đại Tống.'],['你准备好了，我们再见！','Nǐ zhǔnbèi hǎo le, wǒmen zàijiàn!','Khi ngài sẵn sàng, ta gặp lại!']],reward:{exp:500,stone:15}}
];
