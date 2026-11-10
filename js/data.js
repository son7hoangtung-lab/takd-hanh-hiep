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
    {id:'soirung',zh:'野狼',vi:'Sói rừng',art:'wolf',hp:34,atk:6,spd:46,lv:1,exp:9,drop:'thit'}
  ],
  thanglong:[
    {id:'ho',zh:'老虎',vi:'Hổ dữ',art:'tiger',hp:150,atk:19,spd:52,lv:10,exp:36,drop:'thit'}
  ],
  coloa:[
    {id:'matroi',zh:'古城鬼火',vi:'Ma trơi thành cổ',art:'matroi',hp:330,atk:36,spd:44,lv:18,exp:72}
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
  kimlien:{id:'b1',zh:'虎须恶霸',vi:'Ác bá Râu Hùm',art:'cuonghao',hp:1800,atk:26,spd:34,lv:10,exp:600,unlock:'thanglong',leader:1},
  thanglong:{id:'b2',zh:'黑风都尉',vi:'Đô úy Hắc Phong',art:'douy',hp:6500,atk:60,spd:44,lv:22,exp:1800,unlock:'coloa',leader:1},
  coloa:{id:'b4',zh:'石甲将军',vi:'Thạch Giáp tướng quân',art:'thachgiap',hp:11000,atk:86,spd:30,lv:27,exp:2800,unlock:'vandon',leader:1},
  vandon:{id:'b3',zh:'赤须海盗王',vi:'Xích Tu Hải Tặc Vương',art:'warlord',tint:'#9a2222',hp:16000,atk:110,spd:48,lv:28,exp:4000,unlock:null}
};
G.WORLD_BOSS = {id:'wb',zh:'蛟龙',vi:'Giao Long (Thuồng luồng sông Hồng)',art:'serpent',hp:30000,atk:70,spd:40,lv:25,exp:6000,hours:[12,20]};

// --- Cá & món ăn ---
G.FISH = {
  kimlien:[{zh:'鲤鱼',vi:'Cá chép',p:5},{zh:'鲫鱼',vi:'Cá diếc',p:3},{zh:'泥鳅',vi:'Cá chạch',p:4},{zh:'金鲤',vi:'Cá chép vàng',p:40,rare:1}],
  thanglong:[{zh:'草鱼',vi:'Cá trắm',p:8},{zh:'鲶鱼',vi:'Cá trê',p:7},{zh:'黄鳝',vi:'Lươn',p:9},{zh:'龙鱼',vi:'Cá rồng',p:80,rare:1}],
  vandon:[{zh:'鲳鱼',vi:'Cá chim',p:14},{zh:'墨鱼',vi:'Mực',p:16},{zh:'龙虾',vi:'Tôm hùm',p:35},{zh:'石斑鱼',vi:'Cá mú',p:28},{zh:'海龟',vi:'Đồi mồi (thả lại)',p:0,rare:1},{zh:'金枪鱼',vi:'Cá ngừ',p:60,rare:1}]
};
G.POTIONS = [{id:'kimsang',zh:'金疮药',vi:'Kim sang dược',heal:.5,price:30,desc:'Hồi 50% máu'},{id:'hoikhi',zh:'回气丹',vi:'Hồi khí đan',mp:.6,price:30,desc:'Hồi 60% nội lực'}];
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
  coloa:{zh:'古螺城',vi:'Thành Cổ Loa',sub:'Thành ốc ba vòng · đền An Dương Vương',music:'ancient'},
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
    {id:'lytruong',zh:'里长',vi:'Lý trưởng',art:'elder',x:142,y:88,role:'tax'},
    {id:'trangba',zh:'茶婆',vi:'Bà hàng nước',art:'woman',x:125,y:83,shop:'tea'},
    {id:'thoren',zh:'铁匠',vi:'Thợ rèn',art:'smith',x:100,y:97,role:'enhance'},
    {id:'ngung',zh:'渔翁',vi:'Ông lão đánh cá',art:'fisher',x:235,y:111},
    {id:'thaydo',zh:'私塾先生',vi:'Thầy đồ',art:'scholar',x:156,y:100,role:'study'},
    {id:'dichtram',zh:'驿站',vi:'Phu dịch trạm',art:'groom',x:91,y:105,role:'teleport'},
    {id:'thaylang',zh:'郎中',vi:'Thầy lang',art:'doctor',x:146,y:115,shop:'medicine'},
    {id:'caothi',zh:'告示',vi:'Bảng cáo thị',art:'board',x:131,y:90,role:'board'},
    {id:'chohoang',zh:'小狗',vi:'Chó hoang',art:'shiba',x:76,y:108,cond:'noShiba'},
    {id:'linh1',zh:'越拳兵',vi:'Lính Muay Việt',art:'soldier',x:138,y:104,cond:'conq'},
    {id:'linh2',zh:'越拳兵',vi:'Lính Muay Việt',art:'soldier',x:145,y:104,cond:'conq'}
  ],
  thanglong:[
    {id:'phudoan',zh:'府尹',vi:'Phủ doãn',art:'elder',x:210,y:118,role:'tax'},
    {id:'quanvo',zh:'武官',vi:'Quan võ',art:'officer',x:201,y:124},
    {id:'tiensi',zh:'进士',vi:'Ông Tiến sĩ',art:'scholar',x:166,y:160,role:'study'},
    {id:'thoren2',zh:'铁匠',vi:'Lò rèn kinh thành',art:'smith',x:192,y:179,role:'enhance'},
    {id:'thuongnhan',zh:'商人',vi:'Thương nhân',art:'merchant',x:252,y:128,shop:'city'},
    {id:'sukhong',zh:'和尚',vi:'Sư trụ trì',art:'monk',x:163,y:116},
    {id:'thaylang2',zh:'郎中',vi:'Thầy thuốc kinh thành',art:'doctor',x:232,y:135,shop:'medicine'},
    {id:'dichtram2',zh:'驿站',vi:'Dịch trạm kinh thành',art:'groom',x:214,y:190,role:'teleport'},
    {id:'caothi2',zh:'告示',vi:'Bảng cáo thị',art:'board',x:204,y:124,role:'board'},
    {id:'linh3',zh:'越拳兵',vi:'Lính Muay Việt',art:'soldier',x:206,y:115,cond:'conq'},
    {id:'linh4',zh:'越拳兵',vi:'Lính Muay Việt',art:'soldier',x:212,y:115,cond:'conq'}
  ],
  coloa:[
    {id:'ongtu',zh:'庙祝',vi:'Ông từ đền',art:'scholar',x:186,y:112},
    {id:'truongthon',zh:'村长',vi:'Trưởng thôn Cổ Loa',art:'elder',x:188,y:146,role:'tax'},
    {id:'thoren4',zh:'铁匠',vi:'Thợ rèn Cổ Loa',art:'smith',x:168,y:72,role:'enhance'},
    {id:'thaylang3',zh:'郎中',vi:'Thầy lang',art:'doctor',x:226,y:128,shop:'medicine'},
    {id:'dichtram3',zh:'驿站',vi:'Phu dịch trạm',art:'groom',x:160,y:120,role:'teleport'},
    {id:'thuongnhan3',zh:'商人',vi:'Người bán hàng',art:'merchant',x:213,y:155,shop:'city'},
    {id:'linh5',zh:'越拳兵',vi:'Lính Muay Việt',art:'soldier',x:188,y:128,cond:'conq'},
    {id:'linh6',zh:'越拳兵',vi:'Lính Muay Việt',art:'soldier',x:196,y:128,cond:'conq'}
  ],
  vandon:[
    {id:'cangchu',zh:'港主',vi:'Cảng chủ',art:'officer',x:22,y:56},
    {id:'thuongthuyen',zh:'船商',vi:'Chủ thuyền buôn',art:'merchant',x:32,y:52,shop:'port'},
    {id:'baohiem',zh:'保商',vi:'Nhà bảo hộ hàng hóa',art:'scholar',x:14,y:51},
    {id:'thoren3',zh:'铁匠',vi:'Thợ rèn bến cảng',art:'smith',x:10,y:62,role:'enhance'}
  ]
};

// --- Nhiệm vụ chính (type: talk, kill, boss, fish, cook, learn, write, speak, goto, sail, enhance, pk) ---
// d = hội thoại khi nhận: [zh, pinyin, vi]
G.MAIN_QUESTS = [
  {id:'k1',npc:'lytruong',type:'talk',title:'Chàng trai tay trắng',d:[['你好！你是谁？','Nǐ hǎo! Nǐ shì shéi?','Chào cậu! Cậu là ai?'],['你没有钱，也没有家。','Nǐ méiyǒu qián, yě méiyǒu jiā.','Cậu không có tiền, cũng chẳng có nhà.'],['先去学习吧！','Xiān qù xuéxí ba!','Trước hết hãy đi học đi!']],reward:{exp:30,bac:30}},
  {id:'k2',npc:'thaydo',type:'lesson',lesson:1,title:'Bài 1 · 你好 Xin chào',reward:{exp:80,stone:3}},
  {id:'k3',npc:'trangba',type:'talk',title:'Bát cơm cho Shiba',d:[['你的狗饿了吗？','Nǐ de gǒu è le ma?','Chó của cậu đói à?'],['给它吃一点儿饭吧。','Gěi tā chī yìdiǎnr fàn ba.','Cho nó ăn chút cơm đi.'],['狗是人的好朋友。','Gǒu shì rén de hǎo péngyou.','Chó là bạn tốt của người.']],reward:{exp:40,ingr:{gao:1}}},
  {id:'k4',npc:'thoren',type:'talk',title:'Cây gậy tre',d:[['你没有武器吗？','Nǐ méiyǒu wǔqì ma?','Cậu không có vũ khí à?'],['这根竹棍给你。','Zhè gēn zhú gùn gěi nǐ.','Cây gậy tre này cho cậu.']],reward:{exp:40,gear:'staff'}},
  {id:'k5',npc:'lytruong',type:'kill',mob:'soirung',n:6,title:'Sói bìa rừng',d:[['森林里有很多狼。','Sēnlín li yǒu hěn duō láng.','Trong rừng có rất nhiều sói.'],['请你打六只！','Qǐng nǐ dǎ liù zhī!','Xin cậu đánh sáu con!']],reward:{exp:100,bac:60,item:1}},
  {id:'k6',npc:'trangba',type:'lesson',lesson:2,title:'Bài 2 · 谢谢你 Cảm ơn bạn',reward:{exp:90,stone:3,ingr:{gao:1}}},
  {id:'k7',npc:'thoren',type:'enhance',n:1,title:'Học rèn đồ',d:[['东西要强化。','Dōngxi yào qiánghuà.','Đồ phải cường hóa.'],['我帮你。','Wǒ bāng nǐ.','Tôi giúp cậu.']],reward:{exp:60,bac:60}},
  {id:'k8',npc:'thaydo',type:'lesson',lesson:3,title:'Bài 3 · 你叫什么名字',reward:{exp:100,stone:3}},
  {id:'k9',npc:'lytruong',type:'kill',mob:'soirung',n:10,title:'Vào rừng hoang',d:[['大森林里的狼更多。','Dà sēnlín li de láng gèng duō.','Trong rừng lớn sói còn nhiều hơn.'],['穿上这件铠甲吧！','Chuān shang zhè jiàn kǎijiǎ ba!','Mặc bộ giáp này vào!']],reward:{exp:150,bac:90,gear:'armor',rank:1}},
  {id:'k10',npc:'lytruong',type:'lesson',lesson:4,title:'Bài 4 · 她是谁 Cô ấy là ai',reward:{exp:110,stone:3}},
  {id:'k11',npc:'ngung',type:'fish',n:3,title:'Câu cá ở bến đò',d:[['你喜欢吃鱼吗？','Nǐ xǐhuan chī yú ma?','Cậu thích ăn cá không?'],['我们去钓三条鱼吧。','Wǒmen qù diào sān tiáo yú ba.','Chúng ta đi câu ba con cá nhé.']],reward:{exp:80,bac:60}},
  {id:'k12',npc:'thoren',type:'lesson',lesson:5,title:'Bài 5 · 一二三 Số đếm',reward:{exp:120,stone:4}},
  {id:'k13',npc:'ngung',type:'cook',n:1,title:'Bữa cơm bên bến đò',d:[['你饿了吗？','Nǐ è le ma?','Cậu đói chưa?'],['用鱼做菜吧！','Yòng yú zuò cài ba!','Lấy cá nấu món đi!']],reward:{exp:60,ingr:{thit:1,gao:2}}},
  {id:'k14',npc:'ngung',type:'lesson',lesson:6,title:'Bài 6 · 我家有几个人',reward:{exp:130,stone:4}},
  {id:'k15',npc:'dichtram',type:'kill',mob:'soirung',n:15,title:'Con ngựa của dịch trạm',d:[['我的马很怕狼。','Wǒ de mǎ hěn pà láng.','Ngựa của tôi rất sợ sói.'],['你打十五只狼，我送你一匹马！','Nǐ dǎ shíwǔ zhī láng, wǒ sòng nǐ yì pǐ mǎ!','Cậu đánh mười lăm con sói, tôi tặng cậu một con ngựa!']],reward:{exp:220,bac:120,gear:'horse',rank:2}},
  {id:'k16',npc:'thaydo',type:'write',n:3,title:'Luyện viết ba chữ',d:[['写字要慢慢写。','Xiě zì yào mànmàn xiě.','Viết chữ phải viết từ từ.']],reward:{exp:90,stone:4}},
  {id:'k17',npc:'thaydo',type:'speak',n:3,title:'Luyện nói ba câu',d:[['你会说汉语吗？','Nǐ huì shuō Hànyǔ ma?','Cậu biết nói tiếng Hán không?']],reward:{exp:100,stone:4}},
  {id:'k18',npc:'thoren',type:'talk',title:'Cây chùy đồng',d:[['你现在很厉害了！','Nǐ xiànzài hěn lìhai le!','Giờ cậu lợi hại lắm rồi!'],['我给你做了一把铜锤。','Wǒ gěi nǐ zuò le yì bǎ tóng chuí.','Tôi làm cho cậu một cây chùy đồng.']],reward:{exp:120,gear:'mace'}},
  {id:'k19',npc:'thaydo',type:'talk',title:'Lập môn phái Muay Việt',d:[['你想开一个门派吗？','Nǐ xiǎng kāi yí gè ménpài ma?','Cậu muốn lập một môn phái à?'],['好名字：越拳门！','Hǎo míngzi: Yuèquán mén!','Tên hay: Việt Quyền Môn – Muay Việt!']],reward:{exp:200,stone:6,rank:3}},
  {id:'k20',npc:'lytruong',type:'kill',mob:'soirung',n:12,title:'Sói đầu đàn trong rừng sâu',d:[['森林最里面的狼很大。','Sēnlín zuì lǐmiàn de láng hěn dà.','Sói tận sâu trong rừng rất to.'],['小心！','Xiǎoxīn!','Cẩn thận!']],reward:{exp:300,bac:200,item:2}},
  {id:'k21',npc:'lytruong',type:'boss',boss:'kimlien',title:'Hạ thủ lĩnh, chiếm làng',d:[['恶霸住在大房子里。','Èbà zhù zài dà fángzi li.','Tên ác bá sống trong ngôi nhà lớn.'],['他每天打人、要钱。','Tā měitiān dǎ rén, yào qián.','Hắn ngày nào cũng đánh người, đòi tiền.'],['请你打败他！','Qǐng nǐ dǎbài tā!','Xin cậu đánh bại hắn!']],reward:{exp:600,bac:500,item:3}},
  {id:'k22',npc:'lytruong',type:'talk',title:'Chủ làng Kim Liên',d:[['金莲村是你的了！','Jīnlián cūn shì nǐ de le!','Làng Kim Liên là của ngài rồi!'],['每天你可以来收税。','Měitiān nǐ kěyǐ lái shōu shuì.','Mỗi ngày ngài có thể đến thu thuế.'],['下一个：升龙城！','Xià yí gè: Shēnglóng chéng!','Tiếp theo: thành Thăng Long!']],reward:{exp:300,stone:10}},
  {id:'t1',npc:'phudoan',type:'talk',title:'Vào kinh thành',d:[['欢迎来升龙城！','Huānyíng lái Shēnglóng chéng!','Chào mừng đến thành Thăng Long!'],['黑风都尉住在皇城里。','Hēifēng dūwèi zhù zài huángchéng li.','Đô úy Hắc Phong chiếm giữ Hoàng thành.'],['你先去学习吧。','Nǐ xiān qù xuéxí ba.','Ngài hãy đi học trước đã.']],reward:{exp:150,bac:150}},
  {id:'t2',npc:'tiensi',type:'lesson',lesson:7,title:'Bài 7 · 我会说汉语',reward:{exp:300,stone:6}},
  {id:'t3',npc:'quanvo',type:'kill',mob:'ho',n:8,title:'Hổ dữ ngoài thành',d:[['城外的森林里有很多老虎。','Chéng wài de sēnlín li yǒu hěn duō lǎohǔ.','Rừng ngoài thành có rất nhiều hổ.']],reward:{exp:350,bac:300,item:2}},
  {id:'t4',npc:'quanvo',type:'lesson',lesson:8,title:'Bài 8 · 今天几号',reward:{exp:320,stone:6}},
  {id:'t5',npc:'sukhong',type:'talk',title:'Chùa Một Cột',d:[['这个寺只有一根柱子。','Zhège sì zhǐ yǒu yì gēn zhùzi.','Ngôi chùa này chỉ có một cây cột.'],['像一朵莲花。','Xiàng yì duǒ liánhuā.','Giống một đóa hoa sen.']],reward:{exp:200,stone:4}},
  {id:'t6',npc:'thuongnhan',type:'lesson',lesson:9,title:'Bài 9 · 我想买水果',reward:{exp:340,stone:6,ingr:{rau:2}}},
  {id:'t7',npc:'quanvo',type:'pk',n:1,title:'Trừng trị kẻ PK',d:[['有人在路上打人！','Yǒu rén zài lù shang dǎ rén!','Có kẻ đánh người trên đường!']],reward:{exp:300,bac:300}},
  {id:'t8',npc:'sukhong',type:'lesson',lesson:10,title:'Bài 10 · 你在哪儿工作',reward:{exp:360,stone:6}},
  {id:'t9',npc:'quanvo',type:'kill',mob:'ho',n:15,title:'Vào sâu rừng hổ',d:[['森林里面的老虎更大。','Sēnlín lǐmiàn de lǎohǔ gèng dà.','Hổ trong rừng sâu còn to hơn.']],reward:{exp:520,bac:400,item:3}},
  {id:'t10',npc:'thoren2',type:'lesson',lesson:16,title:'Bài đặc biệt · 江湖 (1)',reward:{exp:380,stone:8}},
  {id:'t11',npc:'thoren2',type:'lesson',lesson:17,title:'Bài đặc biệt · 江湖 (2)',reward:{exp:400,stone:8,item:3}},
  {id:'t12',npc:'quanvo',type:'kill',mob:'ho',n:12,title:'Hổ chúa hang sâu',d:[['老虎王住在山洞里。','Lǎohǔ wáng zhù zài shāndòng li.','Hổ chúa sống trong hang núi.'],['小心！','Xiǎoxīn!','Cẩn thận!']],reward:{exp:600,bac:500,item:3}},
  {id:'t13',npc:'phudoan',type:'boss',boss:'thanglong',title:'Hạ Đô úy Hắc Phong, chiếm kinh thành',d:[['黑风都尉不让百姓进皇城。','Hēifēng dūwèi bú ràng bǎixìng jìn huángchéng.','Đô úy Hắc Phong không cho dân vào Hoàng thành.'],['请你打败他！','Qǐng nǐ dǎbài tā!','Xin ngài đánh bại hắn!']],reward:{exp:1500,bac:1200,item:3}},
  {id:'t14',npc:'phudoan',type:'talk',title:'Trấn thủ Thăng Long',d:[['升龙城是你的了！','Shēnglóng chéng shì nǐ de le!','Thành Thăng Long là của ngài rồi!'],['北边有古螺城。','Běibian yǒu Gǔluó chéng.','Phía bắc có thành Cổ Loa.']],reward:{exp:600,stone:12,rank:5}},
  {id:'c1',npc:'ongtu',type:'talk',title:'Thành ốc Cổ Loa',d:[['这是安阳王的古城。','Zhè shì Ān Yáng Wáng de gǔchéng.','Đây là thành cổ của An Dương Vương.'],['城有三层，像螺一样。','Chéng yǒu sān céng, xiàng luó yíyàng.','Thành có ba vòng, giống như con ốc.']],reward:{exp:400,bac:300}},
  {id:'c2',npc:'ongtu',type:'lesson',lesson:11,title:'Bài 11 · 书在桌子上',reward:{exp:500,stone:8}},
  {id:'c3',npc:'truongthon',type:'kill',mob:'matroi',n:10,title:'Ma trơi rừng tây',d:[['晚上森林里有很多鬼火。','Wǎnshang sēnlín li yǒu hěn duō guǐhuǒ.','Ban đêm trong rừng có nhiều ma trơi.'],['我们很害怕。','Wǒmen hěn hàipà.','Chúng tôi rất sợ.']],reward:{exp:700,bac:500,item:3}},
  {id:'c4',npc:'truongthon',type:'lesson',lesson:12,title:'Bài 12 · 现在几点',reward:{exp:550,stone:8}},
  {id:'c5',npc:'ongtu',type:'talk',title:'Giếng Ngọc',d:[['这口井叫珠井。','Zhè kǒu jǐng jiào Zhū jǐng.','Giếng này gọi là Giếng Ngọc.'],['井里有一个很老的故事。','Jǐng li yǒu yí gè hěn lǎo de gùshi.','Trong giếng có một câu chuyện rất xưa.']],reward:{exp:400,stone:6}},
  {id:'c6',npc:'truongthon',type:'kill',mob:'matroi',n:15,title:'Bãi tha ma',d:[['坟地里的鬼火最大。','Féndì li de guǐhuǒ zuì dà.','Ma trơi ở bãi tha ma to nhất.']],reward:{exp:900,bac:700,item:4}},
  {id:'c7',npc:'ongtu',type:'boss',boss:'coloa',title:'Hạ Thạch Giáp tướng quân',d:[['石甲将军占了内城。','Shíjiǎ jiāngjūn zhàn le nèichéng.','Thạch Giáp tướng quân chiếm nội thành.'],['他的身体像石头一样硬！','Tā de shēntǐ xiàng shítou yíyàng yìng!','Thân hắn cứng như đá!']],reward:{exp:2500,bac:1500,item:4}},
  {id:'c8',npc:'truongthon',type:'talk',title:'Chủ thành Cổ Loa',d:[['古螺城是你的了！','Gǔluó chéng shì nǐ de le!','Thành Cổ Loa là của ngài rồi!'],['东边的大海在等你。','Dōngbian de dàhǎi zài děng nǐ.','Biển lớn phía đông đang chờ ngài.']],reward:{exp:800,stone:12}},
  {id:'q30',npc:'cangchu',type:'talk',title:'Cửa biển Vân Đồn',d:[['这里是云屯港，有很多船。','Zhèli shì Yúntún gǎng, yǒu hěn duō chuán.','Đây là cảng Vân Đồn, có rất nhiều thuyền.']],reward:{exp:400,bac:400}},
  {id:'q32',npc:'baohiem',type:'lesson',lesson:18,title:'Bài đặc biệt · 保险 Bảo hộ hàng hóa',reward:{exp:600,stone:10,item:4}},
  {id:'q33',npc:'thuongthuyen',type:'sail',title:'Ra khơi',d:[['你会开船吗？','Nǐ huì kāi chuán ma?','Ngài biết lái thuyền không?'],['坐我的船去海上看看！','Zuò wǒ de chuán qù hǎi shang kànkan!','Ngồi thuyền tôi ra biển xem!']],reward:{exp:500,bac:500}},
  {id:'q35',npc:'cangchu',type:'kill',mob:'haitac',n:10,title:'Hải tặc quấy cảng',d:[['海盗太多了！','Hǎidào tài duō le!','Hải tặc nhiều quá!']],reward:{exp:900,bac:800,item:4}},
  {id:'q36',npc:'thuongthuyen',type:'lesson',lesson:13,title:'Bài 13 · 天气怎么样',reward:{exp:600,stone:8}},
  {id:'q37',npc:'thuongthuyen',type:'lesson',lesson:14,title:'Bài 14 · Giấc mơ nghìn năm sau',reward:{exp:650,stone:10}},
  {id:'q38',npc:'cangchu',type:'lesson',lesson:15,title:'Bài 15 · 我是骑马来的',reward:{exp:700,stone:10,item:4}},
  {id:'q39',npc:'cangchu',type:'boss',boss:'vandon',title:'Xích Tu Hải Tặc Vương',d:[['海盗王住在东边的岛上。','Hǎidào wáng zhù zài dōngbian de dǎo shang.','Hải tặc vương sống trên đảo phía đông.']],reward:{exp:4000,bac:3000,item:5}},
  {id:'q40',npc:'cangchu',type:'talk',title:'Hẹn ngày sang đất Tống',d:[['你学完了HSK一级！','Nǐ xué wán le HSK yī jí!','Ngài đã học xong HSK 1!'],['我们再见！','Wǒmen zàijiàn!','Hẹn gặp lại!']],reward:{exp:500,stone:15}}
];
