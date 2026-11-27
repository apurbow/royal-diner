(() => {
    "use strict";

    const LANGUAGE_STORAGE_KEY = "siteLanguage";

    // Force development language: set DEVELOPMENT_LANGUAGE_OVERRIDE to "ja" or "en".
    // Production: leave it empty. Saved choice → browser language → Japanese fallback.
    // To use one fixed first-visit language, set DETECT_BROWSER_LANGUAGE to false and edit DEFAULT_LANGUAGE.
    const LANGUAGE_CONFIG = {
        DEVELOPMENT_LANGUAGE_OVERRIDE: "",
        DETECT_BROWSER_LANGUAGE: true,
        DEFAULT_LANGUAGE: "ja",
        FALLBACK_LANGUAGE: "ja"
    };

    const translations = {
        "Demo only: Orders, delivery and pickup requests are simulated and will not be fulfilled. Form details are saved only in this browser.": "デモサイトです。ご注文・配達・テイクアウトは実際には受け付けておらず、商品のお届けもありません。入力内容はこのブラウザ内にのみ保存されます。",
        "Demo only: This form does not create a real reservation. Details are saved only in this browser.": "デモサイトです。こちらのフォームから実際の予約はできません。入力内容はこのブラウザ内にのみ保存されます。",
        "Home": "ホーム",
        "Menu": "メニュー",
        "Order": "ご注文",
        "About": "当店について",
        "MAIN CONTENT": "メインコンテンツ",
        "Page Title": "ページタイトル",
        "Page description": "ページの説明",
        "Japanese Western-style comfort food": "どこか懐かしい、心ほどける洋食を",
        "Comfort worth": "また食べたくなる、",
        "coming back to.": "いつものおいしさ",
        "Explore the Menu": "メニューを見る",
        "Comfort, served with care": "心を込めた、いつもの一皿。",
        "A taste of ROYAL DINER": "ROYAL DINERのおすすめ",
        "Royal": "ロイヤル",
        "Favorites": "おすすめ",
        "A few comforting classics to start with. Find your favourite and add it straight to your cart.": "自慢の定番メニューをご紹介。お気に入りを見つけて、そのままカートに追加できます。",
        "View the Full Menu": "すべてのメニューを見る",
        "What's on your mind?": "今日は何を食べたい気分ですか？",
        "Find your": "お気に入りを",
        "favorite.": "見つけよう",
        "Browse by craving and find something that sounds just right.": "その日の気分に合わせて、食べたい一皿を探してみてください。",
        "Browse all menu categories": "カテゴリーから選ぶ",
        "Yoshoku classics": "洋食の定番",
        "Japanese Western-style favourites, from omurice to hearty hamburg steak.": "ふわとろオムライスから食べ応えのあるハンバーグまで、日本生まれの洋食をご用意しています。",
        "A little comfort": "ほっとするおいしさ",
        "Familiar flavours and satisfying plates for an everyday treat.": "親しみのある味わいと満足感のある一皿を、いつものひとときに。",
        "Easy to plan": "ご利用もスムーズに",
        "Browse the menu, build a cart, or reserve a table in a few simple steps.": "メニュー選びからご注文、テーブルのご予約まで、簡単な操作でご利用いただけます。",
        "Good food, your way": "お好きなスタイルで",
        "Ready for something": "おいしい時間を",
        "good?": "楽しみませんか？",
        "Choose how you'd like to enjoy your next ROYAL DINER favourite.": "次のお食事は、ROYAL DINERのお好きなスタイルでお楽しみください。",
        "Order Online": "オンラインで注文",
        "Make a Reservation": "テーブルを予約",
        "Delivery": "デリバリー",
        "Enjoy a meal at home.": "ご自宅までお届けします。",
        "Pickup": "テイクアウト",
        "Order ahead and collect.": "事前に注文して、お店で受け取れます。",
        "Eat-in": "店内でお食事",
        "Take a seat and settle in.": "お席でゆっくりお楽しみください。",
        "Your cart": "カートの中身",
        "items selected": "点の商品を選択中",
        "Around the table": "テーブルを囲むひととき",
        "The little things that": "大切にしたい、",
        "matter.": "小さな心配り",
        "Comforting classics, a welcoming table, and simple ways to plan your next visit.": "親しみのある洋食、くつろげる空間、そして次のご来店を気軽に計画できるサービスをご用意しています。",
        "Some meals become favourites because they feel familiar from the very first bite.": "ひと口目からほっとする。そんな味が、いつものお気に入りになっていきます。",
        "Comforting classics": "心なごむ定番の味",
        "A good meal is even better when there is time to relax and enjoy it.": "ゆっくりくつろぎながら味わえば、おいしさもひときわ。",
        "Easy, unhurried moments": "ゆったりとした時間",
        "From a hearty main to a sweet finish, there is always another favourite to discover.": "ボリュームのあるメインから食後のデザートまで、新しいお気に入りに出会えます。",
        "Something for every craving": "気分にぴったりの一皿",
        "A few helpful answers": "よくあるご質問",
        "Questions,": "気になることに、",
        "answered.": "お答えします",
        "Quick information about the menu, ordering, and reservations.": "メニュー、ご注文、ご予約についてのご案内です。",
        "What is Japanese yoshoku?": "洋食とは何ですか？",
        "Yoshoku is Japanese-style Western cooking. At ROYAL DINER, that means comforting favourites such as omurice, hamburg steak, curry, pasta, and gratin.": "洋食は、西洋料理を日本の食文化に合わせて発展させた料理です。ROYAL DINERでは、オムライスやハンバーグ、カレー、パスタ、ドリアなど、親しみやすい洋食をご提供しています。",
        "Can I add dishes to my cart from the Home page?": "ホーム画面から料理をカートに追加できますか？",
        "Yes. Use Add to Cart on a featured dish. Open the cart icon in the navigation to review items and adjust quantities before continuing to the Order page.": "はい。おすすめ料理の「カートに追加」を押してください。ナビゲーションのカートアイコンから内容や数量を確認し、ご注文画面へ進めます。",
        "How do I place an order?": "注文方法を教えてください。",
        "Open the Order page, choose delivery, pickup, or eat-in, enter the requested details, and review the order before confirming.": "ご注文画面でデリバリー、テイクアウト、店内飲食のいずれかを選び、必要事項を入力してください。内容を確認してから注文を確定できます。",
        "Can I reserve a table in advance?": "事前に席を予約できますか？",
        "Yes. Visit the Reservation page to select a date, time, and guest count, then review your booking details before confirming.": "はい。ご予約画面で来店日、時間、人数を選択し、内容を確認してから予約を確定してください。",
        "Where can I find my order or reservation details?": "注文や予約の内容はどこで確認できますか？",
        "Open the Order page to view order history, or the Reservation page to review upcoming and previous reservations.": "注文履歴はご注文画面から、ご予約の予定や過去の履歴はご予約画面から確認できます。",
        "What are the opening hours?": "営業時間を教えてください。",
        "Lunch: 11:00–15:00. Dinner: 17:00–21:00. Hours may change for holidays or special occasions, so check the latest information before visiting.": "ランチは11:00～15:00、ディナーは17:00～21:00です。祝日や特別営業日には変更となる場合がありますので、ご来店前に最新情報をご確認ください。",
        "Curious about the story behind the food?": "料理に込めた思いをご覧ください。",
        "Get to know ROYAL DINER": "ROYAL DINERについて",
        "Plan your visit": "ご来店のご案内",
        "We'll save you": "お席をご用意して、",
        "a seat.": "お待ちしています",
        "Find the essentials before your next visit to ROYAL DINER.": "ご来店前に知っておきたい情報をご案内します。",
        "Opening Hours": "営業時間",
        "Lunch": "ランチ",
        "Dinner": "ディナー",
        "Find Us": "所在地",
        "Tokyo, Japan": "東京都（日本）",
        "Open map": "地図を見る",
        "Get in Touch": "お問い合わせ",
        "Restaurant": "レストラン",
        "A cozy restaurant serving delicious Western-style Japanese dishes.": "どこか懐かしい日本の洋食を、心を込めてご提供するレストランです。",
        "Social Links": "SNS",
        "Quick Links": "メニューリンク",
        "Information": "店舗情報",
        "About Us": "当店について",
        "Access": "アクセス",
        "Business Hours": "営業時間",
        "Contact": "お問い合わせ",
        "Copyright": "著作権表示",
        "Motion: On": "アニメーション：オン",
        "Motion: Off": "アニメーション：オフ",
        "Turn motion effects off": "アニメーションをオフにする",
        "Turn motion effects on": "アニメーションをオンにする",
        "Motion effects are disabled by your system setting": "端末の視差効果を減らす設定により、アニメーションを停止しています",
        "Visit details": "ご来店内容",
        "Contact and preferences": "連絡先・ご希望",
        "Order and customer details": "ご注文・お客様情報",
        "Price breakdown": "料金内訳",
        "Total": "合計",
        "None": "なし",
        "ROYAL DINER": "ROYAL DINER",
        "All rights reserved.": "無断転載・複製を禁じます。",
        "Our Menu": "メニュー",
        "Japanese Western-style favourites, from classic omurice to hearty diner plates.": "昔ながらのオムライスから食べ応えのある洋食プレートまで、こだわりのメニューをお楽しみください。",
        "items": "点",
        "No dishes found": "該当するメニューが見つかりません",
        "Try another search or choose a different category.": "検索語を変えるか、別のカテゴリーをお選びください。",
        "Show all dishes": "すべての料理を表示",
        "Add to Cart": "カートに追加",
        "Added": "追加しました",
        "Royal Selection": "ロイヤルセレクション",
        "Popular Pick": "人気メニュー",
        "Dish details": "料理の詳細",
        "Order with Royal Diner": "ROYAL DINERでご注文",
        "Place an order, or return to your order details whenever you need them.": "お食事をご注文いただけます。注文履歴から、いつでも過去のご注文内容をご確認いただけます。",
        "Place an Order": "注文する",
        "My Orders": "注文履歴",
        "Your cart is empty": "カートは空です",
        "Add a few dishes from the menu before checking out. Your selected dishes will appear here.": "お会計に進む前に、メニューから料理をお選びください。追加した料理はこちらに表示されます。",
        "1": "1",
        "2": "2",
        "3": "3",
        "Your details": "お客様情報",
        "Review": "確認",
        "How would you like your order?": "ご注文方法をお選びください",
        "Choose the option that works best for you. You can review everything before placing the order.": "ご希望の受け取り方法をお選びください。注文確定前に内容をご確認いただけます。",
        "Select an order type": "注文方法を選択してください",
        "Delivered to your address. Delivery fee: ¥300.": "ご指定の住所へお届けします。配送料：¥300",
        "Collect your order from the restaurant.": "店舗でご注文商品をお受け取りいただけます。",
        "Order for dining in at the restaurant.": "店内でお召し上がりいただくご注文です。",
        "Please select an order type.": "注文方法を選択してください。",
        "Enter the details needed for this order. Fields marked with * are required.": "ご注文に必要な情報をご入力ください。「*」の項目は必須です。",
        "Please check the highlighted fields below.": "入力内容をご確認ください。",
        "Full name": "お名前",
        "Telephone number": "電話番号",
        "Used to contact you about your order.": "ご注文に関するご連絡に使用します。",
        "Use a number where we can reach you about the booking.": "ご予約について連絡可能な電話番号をご入力ください。",
        "Email address": "メールアドレス",
        "optional": "任意",
        "Postal code": "郵便番号",
        "As soon as possible": "できるだけ早く",
        "Schedule for later": "日時を指定する",
        "Choose date and time": "日時を選択",
        "Choose a future time for your order.": "現在より後の日時を選択してください。",
        "Back": "戻る",
        "Review Order": "注文内容を確認",
        "Review your order": "ご注文内容の確認",
        "Check the items, contact details, and total below. Nothing is submitted until you confirm.": "料理、連絡先、合計金額をご確認ください。確定するまで注文は送信されません。",
        "Edit Details": "情報を変更",
        "Place Order": "注文を確定",
        "Order Summary": "注文内容",
        "Edit Cart": "カートを編集",
        "Subtotal": "小計",
        "Delivery fee": "配送料",
        "Estimated total": "お支払い予定額",
        "Delivery fee: ¥300 when delivery is selected.": "デリバリーを選択した場合、配送料¥300が加算されます。",
        "Order confirmed": "ご注文が確定しました",
        "Your order details are ready.": "ご注文内容をご確認いただけます。",
        "Order number": "注文番号",
        "View in My Orders": "注文履歴で確認",
        "Return to Menu": "メニューに戻る",
        "Your order history": "ご注文履歴",
        "Review previous orders, open order details, or retrieve a QR code.": "過去のご注文内容や詳細、QRコードを確認できます。",
        "Start a New Order": "新しく注文する",
        "All": "すべて",
        "Active": "受付中",
        "Your orders will appear here after you place an order.": "ご注文後、こちらに注文履歴が表示されます。",
        "No items in the cart yet.": "カートに商品はありません。",
        "Items": "商品",
        "Name": "お名前",
        "Telephone": "電話番号",
        "Email": "メールアドレス",
        "Not provided": "未入力",
        "Status": "ステータス",
        "Reservation": "ご予約",
        "ロイヤル・ダイナー": "ロイヤル・ダイナー",
        "Reserve Your Table": "お席のご予約",
        "Plan your visit and let us prepare a comfortable table for you.": "ご来店の予定に合わせて、ゆったりとお過ごしいただけるお席をご用意します。",
        "My Reservations": "予約履歴",
        "Your visit": "ご来店内容",
        "When would you like to visit?": "ご来店日時をお選びください",
        "Choose your party size, date, and an available time.": "ご利用人数、日付、空席のある時間をお選びください。",
        "Number of guests": "ご利用人数",
        "guest": "名",
        "guests": "名",
        "Reservation date": "ご予約日",
        "Past dates are unavailable.": "過去の日付は選択できません。",
        "Groups of 7–12 need at least 48 hours' notice. Choose a date and time that meet this requirement.": "7～12名様のご予約は、ご利用の48時間前までにお申し込みください。条件を満たす日時をお選びください。",
        "Available time": "ご予約可能な時間",
        "Choose one of the available times. A slot becomes unavailable when its capacity is reached.": "空いている時間をお選びください。定員に達した時間帯は選択できなくなります。",
        "Choose a date to see available times.": "日付を選択すると、予約可能な時間が表示されます。",
        "Back to Menu": "メニューに戻る",
        "Continue to Details": "お客様情報へ進む",
        "Tell us about your visit": "ご来店について",
        "Enter your contact details and any preferences for your table.": "ご連絡先と、お席についてのご希望をご入力ください。",
        "Occasion": "ご利用目的",
        "No special occasion": "特になし",
        "Birthday": "誕生日",
        "Anniversary": "記念日",
        "Family gathering": "ご家族でのお食事",
        "Business meal": "会食",
        "Other celebration": "その他のお祝い",
        "Seating preference": "お席のご希望",
        "No preference": "指定なし",
        "Window seat": "窓側の席",
        "Quiet area": "静かな席",
        "Booth seating": "ボックス席",
        "Special requests": "その他のご要望",
        "Seating preferences are requests and cannot be guaranteed.": "お席のご希望は確約できません。あらかじめご了承ください。",
        "Review Reservation": "予約内容を確認",
        "Review your reservation": "ご予約内容の確認",
        "Check the details below before confirming your table.": "予約を確定する前に、以下の内容をご確認ください。",
        "Confirm Reservation": "予約を確定",
        "Your Visit": "ご来店内容",
        "Guests": "人数",
        "Date": "日付",
        "Choose a date": "日付を選択",
        "Time": "時間",
        "None selected": "選択なし",
        "Before You Book": "ご予約前にご確認ください",
        "Reservations are available for 1–12 guests.": "ご予約は1～12名様まで承ります。",
        "Groups of 7 or more require 48 hours' notice.": "7名様以上のご予約は48時間前までにお申し込みください。",
        "Seating preferences are subject to availability.": "お席のご希望は空席状況によりご案内いたします。",
        "You can view, edit, or cancel upcoming reservations from My Reservations.": "予約履歴から、今後のご予約の確認・変更・キャンセルができます。",
        "Thank you for choosing Royal Diner": "ROYAL DINERをお選びいただき、ありがとうございます。",
        "Reservation confirmed": "ご予約が確定しました",
        "Reservation details are ready.": "ご予約内容をご確認いただけます。",
        "Reservation number": "予約番号",
        "View My Reservations": "予約履歴を見る",
        "Make Another Reservation": "続けて予約する",
        "Your Reservations": "ご予約履歴",
        "Review your bookings, update upcoming visits, or retrieve a reservation QR code.": "ご予約の確認、今後の予定の変更、QRコードの表示ができます。",
        "New Reservation": "新しく予約する",
        "Upcoming": "今後の予約",
        "Past": "過去の予約",
        "Your bookings will appear here after you make a reservation.": "ご予約後、こちらに予約内容が表示されます。",
        "Reservation details": "予約詳細",
        "Reservation QR code": "予約確認用QRコード",
        "Use this reference when viewing your reservation details.": "予約内容を確認する際に、この番号をご利用ください。",
        "Cancel this reservation?": "この予約をキャンセルしますか？",
        "This reservation will be marked as cancelled.": "この予約はキャンセル済みとして記録されます。",
        "Keep Reservation": "予約を維持する",
        "Cancel Reservation": "予約をキャンセル",
        "Our Story": "ROYAL DINERについて",
        "A familiar table. A little everyday indulgence.": "いつものテーブルで、ちょっと特別なひとときを。",
        "Discover Japanese Western-style comfort food at ROYAL DINER. Explore signature dishes, browse the menu, order online, or reserve a table.": "ROYAL DINERで、日本生まれの洋食をお楽しみください。自慢の料理を見つけたり、オンライン注文やテーブル予約をご利用いただけます。",
        "A place to feel at home": "ほっとくつろげる場所",
        "Made for everyday moments": "いつものひとときに",
        "Comfort, served with care.": "心を込めた、ほっとするおいしさ",
        "Whether you are stopping by for lunch or making dinner part of your day, we want the table to feel easy to come back to.": "ランチにも、いつものディナーにも。何度でも気軽に帰ってきたくなるような食卓を目指しています。",
        "Good food. Unhurried moments.": "おいしい料理と、ゆったり流れる時間",
        "Our concept": "私たちのコンセプト",
        "The Japanese art of yoshoku.": "日本の食文化が育んだ洋食",
        "Discover our dishes": "料理をご紹介",
        "Come as you are": "気軽にお越しください",
        "A place to slow down.": "心ゆくまでくつろげる場所",
        "A welcoming stop for lunch, dinner, and everything in between.": "ランチやディナーはもちろん、日々のさまざまなシーンで気軽にお立ち寄りください。",
        "Familiar favourites, our way.": "おなじみの味を、ROYAL DINERらしく",
        "From a rich, savoury sauce to a golden omelette, these signature plates capture the comfort at the heart of our menu.": "コクのあるソースから黄金色のオムレツまで。自慢の一皿に、私たちが大切にする洋食のおいしさを込めました。",
        "Made for the moments gathered around the table.": "テーブルを囲む、かけがえのない時間のために。",
        "A generous diner-style plate for anyone who wants a little of everything.": "ハンバーグやエビフライなど、人気のおかずを一皿で楽しめるボリューム満点のプレート。",
        "Soft omelette and savoury demi-glace in a comforting yoshoku classic.": "ふんわり卵に、コク深いデミグラスソース。洋食の定番を味わう一皿です。",
        "A warming, hearty favourite for a slower meal.": "じっくり煮込んだ牛肉と野菜を、濃厚なソースで味わうあたたかな一皿。",
        "A satisfying steak with the familiar aroma of garlic butter.": "ガーリックバターの香ばしさが広がる、食べ応えのあるステーキです。",
        "The details matter": "細部まで、丁寧に。",
        "Thoughtfully prepared. Comfortingly familiar.": "丁寧に仕上げた、どこか懐かしい味わい",
        "Little details, lasting memories": "小さな心配りが、心に残る時間に。",
        "A closer look around.": "店内の雰囲気をご紹介します",
        "From a comfortable corner to the details on the table, the atmosphere is part of the experience.": "くつろげる席やテーブルのしつらえまで。店内の雰囲気も、お食事のひとときを彩ります。",
        "A seat waiting for you": "皆さまのお席をご用意しています",
        "Thoughtful table details": "テーブルに込めた心配り",
        "The little things": "ささやかなこだわり",
        "We look forward to welcoming you.": "皆さまのご来店を心よりお待ちしております",
        "Find the details you need before you stop by. We hope to see you around the table soon.": "ご来店前に必要な情報をご確認ください。皆さまとテーブルを囲める日を楽しみにしています。",
        "Location": "所在地",
        "View map": "地図を見る",
        "Last order 30 minutes before closing.": "ラストオーダーは閉店30分前です。",
        "Something good is waiting at the table.": "テーブルには、おいしい時間が待っています。",
        "Your Cart": "カート",
        "Your cart is waiting": "カートは空です",
        "You have not added any dishes yet. Explore the menu and find something you like.": "料理はまだ追加されていません。メニューからお気に入りを見つけてください。",
        "Browse Menu": "メニューを見る",
        "Clear cart": "カートを空にする",
        "Remove all items?": "カート内の商品をすべて削除しますか？",
        "Keep items": "商品を残す",
        "Clear all": "すべて削除",
        "Any delivery fee is shown during checkout. Menu prices are displayed as listed.": "配送料はご注文手続きの際に表示されます。メニュー価格は表示金額のとおりです。",
        "Proceed to Order": "注文手続きへ進む",
        "Continue Shopping": "メニューに戻る",
        "Undo": "元に戻す",
        "each": "（1点）",
        "Remove": "削除",
        "Quantity": "数量",
        "Edit cart items": "カートの内容を編集",
        "Close shopping cart": "カートを閉じる",
        "Open shopping cart": "カートを開く",
        "Open your shopping cart": "カートを開く",
        "Main navigation": "メインナビゲーション",
        "Toggle navigation": "ナビゲーションを切り替え",
        "Menu categories": "メニューカテゴリー",
        "Search menu dishes": "メニューを検索",
        "Search dishes...": "料理名で検索...",
        "Clear search": "検索をクリア",
        "Enlarge photo": "写真を拡大",
        "Close enlarged image": "拡大画像を閉じる",
        "Enlarged food photo": "料理の拡大写真",
        "Close order details": "注文詳細を閉じる",
        "Close reservation details": "予約詳細を閉じる",
        "Close": "閉じる",
        "Order center": "注文メニュー",
        "Checkout progress": "注文手続きの進行状況",
        "Order summary": "注文内容",
        "Filter order history": "注文履歴を絞り込む",
        "Reservation center": "予約メニュー",
        "Reservation progress": "予約手続きの進行状況",
        "Available ordering options": "選択可能な注文方法",
        "Available reservation times": "予約可能な時間",
        "Filter reservations": "予約履歴を絞り込む",
        "Guest notes": "ご来店に関するご要望",
        "Enter your table number": "テーブル番号を入力",
        "Anything that would help us prepare for your visit?": "ご来店にあたり、事前に伝えておきたいことがあればご入力ください。",
        "Allergies or other requests (up to 500 characters)": "アレルギーやその他のご要望（500文字以内）",
        "Your name": "お名前",
        "e.g. 090-1234-5678": "例：090-1234-5678",
        "e.g. 100-0001": "例：100-0001",
        "Street, building, apartment, etc.": "町名・番地・建物名・部屋番号など",
        "you@example.com": "you@example.com",
        "A beautifully plated Japanese Western-style meal served on a warm wooden table": "温かみのある木のテーブルに並べられた、美しく盛り付けた洋食",
        "A carefully arranged selection of ROYAL DINER signature Japanese Western-style dishes": "ROYAL DINER自慢の洋食を丁寧に盛り合わせた一皿",
        "Restaurant table setting with plates, cutlery, and folded napkin": "食器、カトラリー、ナプキンを整えたレストランのテーブル",
        "Seating and warm interior details at ROYAL DINER": "ROYAL DINERのくつろげる客席と温かな店内",
        "Warm, welcoming interior of ROYAL DINER with comfortable seating and soft lighting": "柔らかな照明と心地よい席が広がる、ROYAL DINERの店内",
        "A close-up of the warm textures and small details inside the diner": "店内の温かな質感と細部を写した写真",
        "Featured dishes carousel controls": "おすすめ料理のスライド操作",
        "Featured menu dishes": "おすすめメニュー",
        "Popular menu categories": "人気のメニューカテゴリー",
        "ROYAL DINER highlights": "ROYAL DINERの見どころ",
        "Scroll featured dishes backward": "おすすめ料理を前に戻す",
        "Scroll featured dishes forward": "おすすめ料理を次へ進める",
        "Enter your full name.": "お名前を入力してください。",
        "Enter at least two characters.": "2文字以上で入力してください。",
        "Enter your name using at least two characters.": "お名前を2文字以上で入力してください。",
        "Enter a telephone number.": "電話番号を入力してください。",
        "Enter a valid telephone number.": "有効な電話番号を入力してください。",
        "Enter a valid telephone number with 8–15 digits.": "8～15桁の有効な電話番号を入力してください。",
        "Enter a valid email address or leave this field blank.": "有効なメールアドレスを入力するか、空欄のままにしてください。",
        "Enter the delivery address.": "お届け先住所を入力してください。",
        "Choose a requested date and time.": "ご希望の日時を選択してください。",
        "Choose a time at least 15 minutes from now.": "現在から15分以上先の時間を選択してください。",
        "We could not update the order. Please try again.": "注文を更新できませんでした。もう一度お試しください。",
        "There are no orders in this category. Try another filter to see your saved history.": "このカテゴリーに注文履歴はありません。別の条件でお試しください。",
        "Choose today or a future date.": "本日以降の日付を選択してください。",
        "Past dates cannot be selected.": "過去の日付は選択できません。",
        "No reservation times are available for this date.": "この日に予約可能な時間はありません。",
        "No times are available for this party size. Large parties need at least 48 hours' notice. Try another date.": "この人数で予約できる時間はありません。7名様以上の場合は48時間前までのご予約が必要です。別の日をお選びください。",
        "No times are available for this date and party size. Please choose another date.": "この日程・人数で予約できる時間はありません。別の日をお選びください。",
        "Large-party reservations require at least 48 hours' notice.": "7名様以上のご予約は48時間前までにお申し込みください。",
        "Times update based on saved bookings and the selected party size.": "予約状況とご利用人数に応じて、空席情報が更新されます。",
        "The restaurant is unavailable on this date. Choose another day.": "この日はご予約いただけません。別の日をお選びください。",
        "Groups of 7–12 must book at least 48 hours ahead. Choose a later date and time.": "7～12名様のご予約は48時間前までに必要です。余裕のある日時をお選びください。",
        "That time is no longer available. Please choose another time.": "選択した時間は予約できなくなりました。別の時間をお選びください。",
        "That date and time are no longer available. Please choose another time.": "選択した日時は予約できなくなりました。別の時間をお選びください。",
        "Your updated reservation details are ready.": "更新後のご予約内容をご確認いただけます。",
        "Your table details are ready. We look forward to your visit.": "ご予約内容をご確認いただけます。ご来店をお待ちしております。",
        "This reservation can no longer be edited. Return to My Reservations and choose an upcoming booking.": "この予約は変更できません。予約履歴に戻り、今後の予約を選択してください。",
        "Groups of 7–12 must be booked at least 48 hours ahead. Choose another time.": "7～12名様のご予約は48時間前までに必要です。別の時間をお選びください。",
        "We could not save your reservation. Please try again.": "予約を保存できませんでした。もう一度お試しください。",
        "There are no reservations in this category. Try another filter or make a new booking.": "このカテゴリーに予約履歴はありません。別の条件で検索するか、新しい予約をお取りください。",
        "The reservation could not be cancelled because it could not be saved. Please try again.": "予約のキャンセル内容を保存できませんでした。もう一度お試しください。",
        "Your cart could not be saved. Please try again.": "カートを保存できませんでした。もう一度お試しください。",
        "We could not save your cart. Please try again.": "カートを保存できませんでした。もう一度お試しください。",
        "Your cart has been cleared.": "カートを空にしました。",
        "Cart restored.": "カートを元に戻しました。",
        "Available": "空席あり",
        "Unavailable": "利用不可",
        "Reserved": "満席",
        "Date unavailable": "日付を確認できません",
        "Choose a time": "時間を選択",
        "Scheduled time selected": "指定日時を選択済み",
        "Saving order…": "注文を保存中…",
        "Saving…": "保存中…",
        "We could not save your order. Your cart has been kept; please try again.": "注文を保存できませんでした。カートの内容は保持されています。もう一度お試しください。",
        "Reservation updated": "ご予約を更新しました",
        "Saving Changes": "変更を保存中…",
        "No upcoming reservations": "今後の予約はありません",
        "Order reference QR code": "注文確認用QRコード",
        "Reservation reference QR code": "予約確認用QRコード",
        "Language": "言語",
        "Display language": "表示言語",
        "Find your favourite": "お気に入りを探す",
        "Add to your cart": "カートに追加",
        "No orders yet": "注文履歴はありません",
        "No reservations yet": "予約履歴はありません",
        "Past visit": "過去のご来店",
        "Confirmed": "予約確定",
        "Order details": "注文詳細",
        "Save Changes": "変更を保存",
        "Cancel Order": "注文をキャンセル",
        "Order received": "注文受付済み",
        "Preparing": "調理中",
        "Ready": "準備完了",
        "Completed": "完了",
        "Cancelled": "キャンセル済み",
        "(optional)": "（任意）",
        "More visit information": "ご来店に役立つ情報",
        "This code contains only the order reference.": "このQRコードには注文番号のみが含まれています。",
        "Your reservation details are ready.": "ご予約内容をご確認いただけます。",
        "ROYAL DINER Home": "ROYAL DINER ホーム",
        "Shopping Cart": "ショッピングカート",
        "ROYAL DINER logo": "ROYAL DINERのロゴ",
        "QR code containing this order reference": "注文番号を含むQRコード",
        "QR code containing this reservation reference": "予約番号を含むQRコード",
        "The reservation was saved, but the QR code could not be generated.": "予約は保存されましたが、QRコードを生成できませんでした。",
        "The order was saved, but the QR code could not be generated.": "注文は保存されましたが、QRコードを生成できませんでした。",
        "Choose a reservation date.": "ご予約日を選択してください。",
        "Choose an available reservation time.": "予約可能な時間を選択してください。",
        "Past time": "受付時間外",
        "48h notice": "48時間前までの予約が必要",
        "Full": "満席",
        "Not enough seats": "空席数が不足しています",
        "Guest": "お客様",
        "Details & QR": "詳細・QRコード",
        "View Details & QR": "詳細・QRコードを見る",
        "Edit": "変更",
        "Cancel": "キャンセル",
        "Order placed": "注文受付済み",
        "Ready for pickup": "受け取り準備完了",
        "Order recorded": "注文記録済み",
        "RESERVATION #": "予約番号 #",
        "Time:": "時間：",
        "Order type": "注文方法",
        "Requested time": "ご希望の受取時間",
        "Delivery address": "お届け先住所",
        "Table number": "テーブル番号",
        "Order notes": "ご注文に関するご要望",
        "Royal Diner brings together the comforting spirit of Japanese yoshoku and the relaxed warmth of a classic diner. From a softly glazed omurice to a slow-cooked stew, we believe a good meal can turn an ordinary day into something worth lingering over.": "ROYAL DINERは、日本の洋食が持つ親しみやすさと、昔ながらのダイナーのくつろいだ雰囲気を大切にしています。ふんわり仕上げたオムライスからじっくり煮込んだシチューまで、一皿のおいしさが何気ない一日を少し特別な時間に変えてくれると信じています。",
        "brings together the comforting spirit of Japanese yoshoku and the relaxed warmth of a classic diner. From a softly glazed omurice to a slow-cooked stew, we believe a good meal can turn an ordinary day into something worth lingering over.": "日本の洋食が持つ親しみやすさと、昔ながらのダイナーのくつろいだ雰囲気を大切にしています。ふんわり仕上げたオムライスからじっくり煮込んだシチューまで、一皿のおいしさが何気ない一日を少し特別な時間に変えてくれると信じています。",
        "Our approach is simple: let each dish be itself. We focus on balanced seasoning, satisfying textures, and plates that feel inviting from the first aroma to the final spoonful. Everyday comfort deserves care, and we bring that intention to the food we serve.": "私たちが大切にしているのは、料理そのもののおいしさを引き出すこと。味付けのバランスや食感、運ばれてきた瞬間の香りから最後のひと口まで、心地よく味わえる一皿を目指しています。日々の食事だからこそ、丁寧に心を込めてご提供します。",
        "Some meals stay with us because they feel familiar. At ROYAL DINER, we celebrate the kind of food people return to: satisfying plates, thoughtful seasoning, and a welcome that gives everyone room to relax.": "何度も食べたくなる料理には、どこか懐かしい安心感があります。ROYAL DINERでは、満足感のある一皿、丁寧な味付け、そして誰もがゆったり過ごせるおもてなしを大切にしています。",
        "Warm colours, comfortable seats, and the aroma of a freshly prepared meal set the tone. Whether you are dining on your own, catching up with friends, or gathering with family, ROYAL DINER is designed for easy, unhurried moments.": "温かみのある色合いと心地よい席、できたての料理の香り。おひとりでのお食事も、ご友人との語らいも、ご家族との団らんも、ROYAL DINERで気負わずゆっくりお楽しみください。",
        "洋食 describes Japanese interpretations of Western-style cooking: familiar diner favourites made part of everyday life in Japan. Omurice, hamburg steak, gratin, curry, and more bring hearty, comforting flavours to one table.": "洋食とは、西洋料理を日本の食文化や好みに合わせて発展させた料理のこと。オムライス、ハンバーグ、グラタン、カレーなど、ボリュームがありながら親しみやすい味わいが、日本の日常の食卓に根付いています。",
        "Facebook": "Facebook",
        "Instagram": "Instagram",
        "X": "X"
    };
    const categoryTranslations = {
        "All": "すべて",
        "Royal Selection": "ロイヤルセレクション",
        "Rice & Omurice": "ライス・オムライス",
        "Steak & Hamburg": "ステーキ・ハンバーグ",
        "Pasta & Oven-Baked": "パスタ・オーブン料理",
        "Curry & Stews": "カレー・シチュー",
        "Chicken & Seafood": "チキン・シーフード",
        "Sides & Salads": "サイドメニュー・サラダ",
        "Bread & Bakery": "パン・ベーカリー",
        "Desserts": "デザート",
        "Drinks": "ドリンク"
    };

    const menuTranslations = {
        "royal-mixed-plate": ["ロイヤルミックスプレート", "ハンバーグ、エビフライ、目玉焼きとサイドメニューを盛り合わせた、満足感たっぷりのプレート。", "ハンバーグ、サクサクのエビフライ、目玉焼き、野菜に、コクのあるデミグラスソースを添えました。"],
        "royal-demi-glace-omurice": ["ロイヤルデミグラスオムライス", "チキンライスをふんわり卵で包み、じっくり煮込んだ濃厚なデミグラスソースをかけました。", "味付けしたチキンライス、ふんわりオムレツ、デミグラスソースにパセリを添えています。"],
        "slow-cooked-beef-stew": ["じっくり煮込んだビーフシチュー", "やわらかな牛肉と野菜を、深みのある艶やかなブラウンソースで煮込みました。", "牛肉、にんじん、じゃがいも、玉ねぎを、コク深いデミグラス風ソースでじっくり煮込んでいます。"],
        "garlic-butter-beef-steak": ["ガーリックバタービーフステーキ", "香ばしく焼いた牛肉に、風味豊かなガーリックバターと特製ソースを合わせました。", "牛ステーキにガーリックバターとソースを添え、季節の野菜とライスとともにご提供します。"],
        "royal-seafood-plate": ["ロイヤルシーフードプレート", "エビフライとサクッと揚げた白身魚に、自家製タルタルソースを添えた人気の一皿。", "エビフライ、白身魚フライ、千切りキャベツ、レモン、自家製タルタルソースを盛り合わせました。"],
        "classic-omurice": ["昔ながらのオムライス", "ケチャップ風味のチキンライスを、やわらかな卵で包んだ定番のオムライス。", "チキンライス、ふんわり卵、トマトソースにパセリを添えています。"],
        "cheese-omurice": ["チーズオムライス", "チキンライスとふんわり卵に、とろけるチーズとトマトソースを合わせました。", "チキンライス、ふんわり卵、とろけるチーズ、まろやかなトマトソースを使用しています。"],
        "hayashi-rice": ["ハヤシライス", "薄切り牛肉と玉ねぎをまろやかなブラウンソースで煮込み、ご飯にかけました。", "薄切り牛肉、やわらかく炒めた玉ねぎ、ハヤシソース、炊きたてのご飯を合わせています。"],
        "garlic-beef-rice": ["ガーリックビーフライス", "薄切り牛肉とご飯を、香ばしいガーリックソースで炒め合わせました。", "ご飯、牛肉、炒め玉ねぎ、ガーリック醤油ソース、青ねぎを使用しています。"],
        "classic-hamburg-steak": ["定番ハンバーグステーキ", "肉汁あふれるハンバーグに、定番のブラウンソースを添えました。", "焼き上げたハンバーグに、デミグラス風ブラウンソースと季節の野菜を添えています。"],
        "cheese-hamburg-steak": ["チーズハンバーグステーキ", "ふっくら焼いたハンバーグに、とろけるチーズと濃厚なブラウンソースを合わせました。", "焼き上げたハンバーグ、とろけるチーズ、ブラウンソース、季節の野菜を盛り付けています。"],
        "japanese-style-hamburg-steak": ["和風おろしハンバーグ", "焼き上げたハンバーグに、大根おろしとさっぱりしたポン酢を添えました。", "ハンバーグ、大根おろし、ポン酢、季節の野菜を合わせています。"],
        "pepper-beef-steak": ["ペッパービーフステーキ", "黒こしょうをきかせた牛ステーキに、旨みのあるステーキソースを合わせました。", "牛肉に黒こしょうソースと季節の野菜を添え、ライスとともにご提供します。"],
        "napolitan-pasta": ["ナポリタン", "ケチャップベースのソースに、ソーセージと野菜を合わせた昔ながらのナポリタン。", "スパゲッティ、ソーセージ、玉ねぎ、ピーマンを、ほどよい甘さのトマトソースで炒めました。"],
        "creamy-mushroom-pasta": ["きのこのクリームパスタ", "炒めたきのこの旨みを、クリーミーなソースと黒こしょうで引き立てました。", "スパゲッティ、きのこ、クリームソース、黒こしょう、粉チーズを使用しています。"],
        "shrimp-tomato-cream-pasta": ["エビのトマトクリームパスタ", "エビとパスタに、なめらかなトマトクリームソースをたっぷり絡めました。", "スパゲッティ、エビ、トマトクリームソース、にんにく、パセリを使用しています。"],
        "classic-carbonara": ["クラシックカルボナーラ", "ベーコン、卵、チーズ、黒こしょうを使ったクリーミーなパスタ。", "スパゲッティ、ベーコン、卵、粉チーズ、挽きたての黒こしょうを合わせています。"],
        "beef-lasagna": ["ビーフラザニア", "パスタと旨みたっぷりのビーフソースを重ね、チーズをこんがり焼き上げました。", "パスタ、牛肉入りトマトソース、ホワイトソース、チーズを重ねて焼き上げています。"],
        "chicken-doria": ["チキンドリア", "チキンライスにクリーミーなホワイトソースとチーズをのせて焼き上げました。", "味付けご飯、チキン、ホワイトソース、とろけるチーズをオーブンで焼いています。"],
        "seafood-doria": ["シーフードドリア", "魚介とご飯にクリーミーなソースを合わせ、チーズをこんがり焼き上げました。", "ご飯、エビ、ミックスシーフード、ホワイトソース、焼きチーズを使用しています。"],
        "japanese-beef-curry": ["日本風ビーフカレー", "やわらかな牛肉を使った、まろやかな味わいの日本風カレー。ご飯と一緒にどうぞ。", "日本風カレーソース、やわらかな牛肉、玉ねぎ、炊きたてのご飯を合わせています。"],
        "chicken-katsu-curry": ["チキンカツカレー", "サクサクのチキンカツに、日本風カレーとご飯を添えました。", "衣をつけて揚げたチキンカツ、日本風カレーソース、炊きたてのご飯を盛り付けています。"],
        "hamburg-curry": ["ハンバーグカレー", "香ばしく焼いたハンバーグに、コクのある日本風カレーとご飯を合わせました。", "焼き上げたハンバーグ、日本風カレーソース、炊きたてのご飯を使用しています。"],
        "chicken-nanban": ["チキン南蛮", "揚げたチキンに甘酢だれを絡め、クリーミーなタルタルソースを添えました。", "鶏の唐揚げ、甘酢南蛮だれ、タルタルソース、千切りキャベツを盛り付けています。"],
        "herb-grilled-chicken": ["ハーブチキンのグリル", "ハーブ、にんにく、黒こしょうで味付けしたチキンを香ばしく焼き上げました。", "グリルチキンにハーブ、にんにく、黒こしょうをきかせ、季節の野菜を添えています。"],
        "fried-shrimp-plate": ["エビフライプレート", "衣はサクサク、エビはぷりっと。レモンと自家製タルタルソースを添えました。", "エビフライ、千切りキャベツ、レモン、タルタルソース、ライスのセットです。"],
        "salmon-meuniere": ["サーモンのムニエル", "フライパンで香ばしく焼いたサーモンに、レモンバターソースを添えました。", "サーモンのムニエルにレモンバターソースと季節の野菜を添え、ライスとともにご提供します。"],
        "house-salad": ["ハウスサラダ", "シャキシャキの野菜を使った、みずみずしいサイドサラダ。自家製ドレッシングでどうぞ。", "葉野菜、トマト、きゅうり、自家製ドレッシングを使用しています。"],
        "caesar-salad": ["シーザーサラダ", "新鮮な葉野菜に、シーザードレッシング、クルトン、チーズを合わせました。", "葉野菜、シーザードレッシング、クルトン、粉チーズを使用しています。"],
        "french-fries": ["フライドポテト", "揚げたてのポテトに、軽く塩を振って仕上げました。", "カリッと揚げたポテトに塩を添えています。ケチャップは別添えです。"],
        "onion-rings": ["オニオンリング", "甘みのある玉ねぎを、サクサクの衣で包んで揚げました。", "玉ねぎに軽く味付けした衣をまとわせ、きつね色になるまで揚げています。"],
        "corn-potage": ["コーンポタージュ", "とうもろこしの自然な甘みを生かした、なめらかで温かいスープ。", "クリーミーなコーンスープに、黒こしょうをほんのりきかせています。"],
        "garlic-toast": ["ガーリックトースト", "ガーリックバターとハーブを塗り、香ばしく焼き上げたトースト。", "スライスしたパンにガーリックバターとハーブを塗り、端がカリッとするまで焼いています。"],
        "dinner-rolls": ["ディナーロール", "表面をほんのり焼いた、ふんわりやわらかな温かいロールパン。", "やわらかなロールパンを温めてご提供します。"],
        "classic-butter-toast": ["バタートースト", "厚切りトーストにバターを添えた、シンプルな定番メニュー。", "厚切りパンをこんがり焼き、バターを添えています。"],
        "garlic-bread": ["ガーリックブレッド", "ガーリックバターを塗って焼き上げた、香ばしい味わいのパン。", "パンにガーリックバターとハーブを塗り、きつね色になるまで焼いています。"],
        "cheese-garlic-toast": ["チーズガーリックトースト", "ガーリックトーストに、とろけるチーズをのせて焼き上げました。", "トーストにガーリックバター、ハーブ、とろけるチーズを合わせています。"],
        "royal-custard-pudding": ["ロイヤルカスタードプリン", "なめらかなカスタードプリンに、コクのあるカラメルソースをかけました。", "卵の風味豊かな昔ながらのカスタードプリンに、艶やかなカラメルソースを添えています。"],
        "chocolate-lava-cake": ["チョコレートケーキ", "濃厚なチョコレートの味わいを楽しめる、食後にぴったりのケーキ。", "チョコレートケーキを一切れご提供します。"],
        "new-york-cheesecake": ["ニューヨークチーズケーキ", "クリーミーでなめらかな食感に焼き上げた、定番のチーズケーキ。", "クリームチーズのなめらかなフィリングを使ったベイクドチーズケーキです。"],
        "apple-pie-ice-cream": ["アップルパイとアイスクリーム", "温かいアップルパイに、バニラアイスクリームを添えました。", "シナモン風味のりんごフィリングを包んだアップルパイとバニラアイスのセットです。"],
        "seasonal-parfait": ["季節のパフェ", "クリームやフルーツを重ね、甘いトッピングで仕上げた季節のパフェ。", "季節のフルーツ、アイスクリーム、クリーム、時期に合わせたトッピングを使用しています。"],
        "matcha-tiramisu": ["抹茶ティラミス", "抹茶のほろ苦さが広がる、なめらかでクリーミーなティラミス。", "マスカルポーネクリームと抹茶を染み込ませたスポンジを重ね、抹茶パウダーで仕上げています。"],
        "vanila-swiss-roll": ["スイスロール", "ふんわり焼き上げたスポンジで、軽やかなクリームを巻きました。", "やわらかなロールケーキに、なめらかなホイップクリームを合わせています。"],
        "cola": ["コーラ", "氷を入れて冷たくご提供する、定番のコーラ。", "グラスに注いだ冷たいコーラを、氷とともにご提供します。"],
        "ginger-ale": ["ジンジャーエール", "ほどよいスパイス感とすっきりした後味の、冷たいジンジャーソーダ。", "冷たいジンジャーエールをグラスでご提供します。氷はご希望に応じてお付けします。"],
        "melon-soda": ["メロンソーダ", "甘いメロン風味が広がる、昔懐かしい冷たいソーダ。", "氷を入れた冷たいメロンソーダです。"],
        "melon-soda-float": ["メロンクリームソーダ", "メロンソーダにバニラアイスをのせた、喫茶店の定番ドリンク。", "冷たいメロンソーダにバニラアイスとチェリーを添えています。"],
        "grape-juice": ["ぶどうジュース", "甘みのあるぶどうジュースを、冷たいグラスでご提供します。", "冷たいぶどうジュースです。氷はご希望に応じてお付けします。"],
        "orange-juice": ["オレンジジュース", "すっきり爽やかなオレンジジュースを冷たくご提供します。", "冷たいオレンジジュースです。氷はご希望に応じてお付けします。"],
        "apple-juice": ["りんごジュース", "すっきりとした甘さのりんごジュースを冷たくご提供します。", "冷たいりんごジュースです。氷はご希望に応じてお付けします。"],
        "lemon-squash": ["レモンスカッシュ", "レモンの爽やかな酸味が広がる、炭酸入りのドリンク。", "レモンシロップと炭酸水を氷とともにご提供します。"],
        "iced-tea": ["アイスティー", "香り豊かな紅茶を、すっきり冷たいアイスティーにしました。", "ストレートの冷たい紅茶です。レモンはご希望に応じてお付けします。"],
        "hot-tea": ["ホットティー", "温かい紅茶で、ほっと一息。", "温かい紅茶です。ミルクまたはレモンはご希望に応じてお付けします。"],
        "oolong-tea": ["ウーロン茶", "香ばしくすっきりとした味わいの、甘くない冷たい中国茶。", "すっきりとした軽い焙煎香が特徴の、冷たいウーロン茶です。"],
        "hot-coffee": ["ホットコーヒー", "淹れたてのコーヒーを温かい一杯でご提供します。", "淹れたてのホットコーヒーです。"],
        "iced-coffee": ["アイスコーヒー", "淹れたてのコーヒーを氷で冷やしてご提供します。", "氷を入れた冷たいコーヒーです。"],
        "matcha-latte": ["抹茶ラテ", "抹茶とミルクを合わせた、まろやかで香り豊かなドリンク。", "抹茶とミルクを合わせたドリンクです。ホットまたはアイスをお選びいただけます。"],
        "draft-beer": ["生ビール", "きめ細かな泡とすっきりした喉ごしの、冷たい生ビール。", "グラスに注いだ冷たい生ビールです。"],
        "house-wine": ["ハウスワイン", "洋食メニューと相性のよい、当店おすすめのグラスワイン。", "ハウスワイン（赤）を通常のワイングラスでご提供します。"],
        "whisky-highball": ["ウイスキーハイボール", "ウイスキーとソーダを合わせた、すっきり爽やかなハイボール。", "ウイスキーと冷たいソーダを氷で割り、レモンを添えています。"]
    };

    const originalText = new WeakMap();
    const renderedText = new WeakMap();
    const originalAttributes = new WeakMap();
    const menuTextTranslations = {};
    let currentLanguage = "ja";
    let observer = null;
    let isTranslating = false;

    function getBrowserLanguage() {
        const browserLanguage = String(navigator.languages?.[0] || navigator.language || navigator.userLanguage || "").toLowerCase();
        if (browserLanguage.startsWith("ja")) return "ja";
        if (browserLanguage.startsWith("en")) return "en";
        return LANGUAGE_CONFIG.FALLBACK_LANGUAGE;
    }

    function getInitialLanguage() {
        const override = LANGUAGE_CONFIG.DEVELOPMENT_LANGUAGE_OVERRIDE;
        if (override === "ja" || override === "en") return override;
        try {
            const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
            if (saved === "ja" || saved === "en") return saved;
        } catch (error) {
            console.warn("Language preference could not be read:", error);
        }
        if (LANGUAGE_CONFIG.DETECT_BROWSER_LANGUAGE) return getBrowserLanguage();
        return LANGUAGE_CONFIG.DEFAULT_LANGUAGE;
    }

    function translateValue(value) {
        const source = String(value ?? "");
        if (currentLanguage !== "ja") return source;
        const leading = source.match(/^\s*/)?.[0] || "";
        const trailing = source.match(/\s*$/)?.[0] || "";
        const trimmed = source.trim().replace(/\s+/g, " ");
        if (!trimmed) return source;
        const mapped = translations[trimmed] || menuTextTranslations[trimmed] || categoryTranslations[trimmed];
        if (mapped) return `${leading}${mapped}${trailing}`;

        let match = trimmed.match(/^Quantity (\d+) × (.+)$/i);
        if (match) return `数量 ${match[1]}点 × ${match[2]}`;
        match = trimmed.match(/^(¥[\d,]+)\s+each$/i);
        if (match) return `${match[1]}／点`;
        match = trimmed.match(/^(\d+)\s+items? selected$/i);
        if (match) return `${match[1]}点の商品を選択中`;
        match = trimmed.match(/^(\d+)\s+items?$/i);
        if (match) return `${match[1]}点`;
        match = trimmed.match(/^(\d+)\s+guests?$/i);
        if (match) return `${match[1]}名`;
        match = trimmed.match(/^Qty\s+(\d+)\s+·\s+(.+?)\s+each$/i);
        if (match) return `数量 ${match[1]} ・ ${match[2]}（1点）`;
        match = trimmed.match(/^Order reference:\s*(.+)$/i);
        if (match) return `注文番号：${match[1]}`;
        match = trimmed.match(/^Reservation reference:\s*(.+)$/i);
        if (match) return `予約番号：${match[1]}`;
        match = trimmed.match(/^ORDER #(.+)$/i);
        if (match) return `注文番号 #${match[1]}`;
        match = trimmed.match(/^RESERVATION #(.+)$/i);
        if (match) return `予約番号 #${match[1]}`;
        match = trimmed.match(/^Time:\s*(.+)$/i);
        if (match) return `時間：${match[1]}`;
        match = trimmed.match(/^Order (RD-[A-Z0-9-]+)$/i);
        if (match) return `注文 ${match[1]}`;
        match = trimmed.match(/^Reservation (RD-[A-Z0-9-]+)$/i);
        if (match) return `予約 ${match[1]}`;
        match = trimmed.match(/^\+ (\d+) more$/i);
        if (match) return `ほか${match[1]}点`;
        match = trimmed.match(/^Open your shopping cart, (\d+) items? selected$/i);
        if (match) return `カートを開く（${match[1]}点選択中）`;
        match = trimmed.match(/^Quantity for (.+)$/i);
        if (match) return `${translateValue(match[1])}の数量`;
        match = trimmed.match(/^Decrease quantity of (.+)$/i);
        if (match) return `${translateValue(match[1])}の数量を減らす`;
        match = trimmed.match(/^Increase quantity of (.+)$/i);
        if (match) return `${translateValue(match[1])}の数量を増やす`;
        match = trimmed.match(/^Enlarge photo of (.+)$/i);
        if (match) return `${translateValue(match[1])}の写真を拡大`;
        match = trimmed.match(/^More information about (.+)$/i);
        if (match) return `${translateValue(match[1])}の詳細情報`;
        match = trimmed.match(/^Details for (.+)$/i);
        if (match) return `${translateValue(match[1])}の詳細`;
        match = trimmed.match(/^Add (.+) to cart$/i);
        if (match) return `${translateValue(match[1])}をカートに追加`;
        match = trimmed.match(/^(.+) added to your cart\.$/i);
        if (match) return `${translateValue(match[1])}をカートに追加しました。`;
        match = trimmed.match(/^(.+) removed from your cart\.$/i);
        if (match) return `${translateValue(match[1])}をカートから削除しました。`;
        match = trimmed.match(/^Cancel order (.+)\?$/i);
        if (match) return `注文 ${match[1]} をキャンセルしますか？`;
        match = trimmed.match(/^Cancel the reservation for (.+) for (\d+) guests?\?$/i);
        if (match) return `${match[1]}の予約（${match[2]}名様）をキャンセルしますか？`;
        match = trimmed.match(/^Choose between 1 and (\d+) guests\.$/i);
        if (match) return `ご利用人数は1～${match[1]}名様で選択してください。`;
        match = trimmed.match(/^No matching orders$/i);
        if (match) return "該当する注文はありません";
        match = trimmed.match(/^No matching reservations$/i);
        if (match) return "該当する予約はありません";
        match = trimmed.match(/^No (.+) orders$/i);
        if (match) return `該当する注文はありません（${translateValue(match[1])}）`;
        match = trimmed.match(/^No (.+) reservations$/i);
        if (match) return `該当する予約はありません（${translateValue(match[1])}）`;
        return source;
    }

    function translateTextNode(node) {
        if (!node || node.nodeType !== Node.TEXT_NODE) return;
        const parent = node.parentElement;
        if (!parent || parent.closest("script, style, noscript, code, pre")) return;
        const actual = node.nodeValue;
        if (!originalText.has(node)) {
            originalText.set(node, actual);
        } else if (renderedText.has(node) && actual !== renderedText.get(node)) {
            originalText.set(node, actual);
        }
        const base = originalText.get(node);
        const next = currentLanguage === "ja" ? translateValue(base) : base;
        renderedText.set(node, next);
        if (actual !== next) node.nodeValue = next;
    }

    const translatedAttributes = ["aria-label", "aria-description", "title", "placeholder", "alt"];
    function translateElement(element) {
        if (!(element instanceof Element)) return;
        translatedAttributes.forEach(attribute => {
            if (!element.hasAttribute(attribute)) return;
            let saved = originalAttributes.get(element);
            if (!saved) {
                saved = { values: {}, rendered: {} };
                originalAttributes.set(element, saved);
            }
            const actual = element.getAttribute(attribute);
            if (!(attribute in saved.values) || (attribute in saved.rendered && actual !== saved.rendered[attribute])) {
                saved.values[attribute] = actual;
            }
            const base = saved.values[attribute];
            const next = currentLanguage === "ja" ? translateValue(base) : base;
            saved.rendered[attribute] = next;
            if (actual !== next) element.setAttribute(attribute, next);
        });
    }

    function translateTree(root = document.body) {
        if (!root || isTranslating) return;
        isTranslating = true;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) translateTextNode(node);
        if (root instanceof Element) translateElement(root);
        root.querySelectorAll?.("*").forEach(translateElement);
        isTranslating = false;
    }

    function setLanguage(language, persist = true) {
        if (language !== "ja" && language !== "en") return;
        currentLanguage = language;
        document.documentElement.lang = language;
        document.documentElement.setAttribute("data-language", language);
        if (persist) {
            try { localStorage.setItem(LANGUAGE_STORAGE_KEY, language); }
            catch (error) { console.warn("Language preference could not be saved:", error); }
        }
        updateLanguageControls();
        updatePageMetadata();
        translateTree();
        window.dispatchEvent(new CustomEvent("language:changed", { detail: { language } }));
    }

    function updateLanguageControls() {
        document.querySelectorAll("[data-language-select]").forEach(select => {
            select.value = currentLanguage;
        });
    }

    function updatePageMetadata() {
        const file = location.pathname.split("/").pop() || "index.html";
        const metadata = {
            "index.html": { en: "Home | ROYAL DINER", ja: "ホーム | ROYAL DINER", descEn: "Discover Japanese Western-style comfort food at ROYAL DINER. Explore signature dishes, browse the menu, order online, or reserve a table.", descJa: "ROYAL DINERで、日本生まれの洋食をお楽しみください。おすすめ料理やメニュー、ご注文、ご予約をご案内します。" },
            "menu.html": { en: "Our Menu | ROYAL DINER", ja: "メニュー | ROYAL DINER", descEn: "Explore the ROYAL DINER menu of Japanese Western-style comfort food, classic omurice, hamburg steak, pasta, desserts, and drinks.", descJa: "ROYAL DINERの洋食メニューをご覧ください。オムライス、ハンバーグ、パスタ、デザート、ドリンクをご用意しています。" },
            "order.html": { en: "Order | ROYAL DINER", ja: "ご注文 | ROYAL DINER", descEn: "Place a ROYAL DINER order, review checkout details, and view your order history.", descJa: "ROYAL DINERでのご注文、注文内容の確認、注文履歴の閲覧はこちらから。" },
            "reservation.html": { en: "Reservation | ROYAL DINER", ja: "ご予約 | ROYAL DINER", descEn: "Reserve a table at ROYAL DINER, manage upcoming bookings, and retrieve reservation details.", descJa: "ROYAL DINERのテーブル予約、今後の予約の管理、予約内容の確認はこちらから。" },
            "about.html": { en: "Our Story | ROYAL DINER", ja: "当店について | ROYAL DINER", descEn: "Get to know ROYAL DINER: our love for Japanese Western-style comfort food, welcoming atmosphere, signature dishes, and visit information.", descJa: "ROYAL DINERの洋食へのこだわり、店内の雰囲気、自慢の料理、店舗情報をご紹介します。" }
        };
        const page = metadata[file];
        if (!page) return;
        document.title = currentLanguage === "ja" ? page.ja : page.en;
        const description = document.querySelector('meta[name="description"]');
        if (description) description.content = currentLanguage === "ja" ? page.descJa : page.descEn;
    }

    function localizedMenuField(id, field, fallback = "") {
        const entry = menuTranslations[id];
        const index = ({ name: 0, description: 1, details: 2 })[field];
        return currentLanguage === "ja" && entry && index !== undefined ? entry[index] : fallback;
    }

    function localizedCategory(category) {
        return currentLanguage === "ja" ? (categoryTranslations[category] || category) : category;
    }

    function siteLocale() {
        return currentLanguage === "ja" ? "ja-JP" : "en-GB";
    }

    function init() {
        if (typeof MENU_ITEMS !== "undefined" && Array.isArray(MENU_ITEMS)) {
            MENU_ITEMS.forEach(item => {
                const localized = menuTranslations[item.id];
                if (!localized) return;
                menuTextTranslations[item.name] = localized[0];
                menuTextTranslations[item.description] = localized[1];
                menuTextTranslations[item.details] = localized[2];
            });
        }
        const selected = getInitialLanguage();
        document.querySelectorAll("[data-language-select]").forEach(select => {
            select.addEventListener("change", () => setLanguage(select.value));
        });
        setLanguage(selected, false);

        observer = new MutationObserver(records => {
            if (isTranslating) return;
            records.forEach(record => {
                if (record.type === "characterData") translateTextNode(record.target);
                if (record.type === "attributes") translateElement(record.target);
                record.addedNodes?.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
                    else if (node.nodeType === Node.ELEMENT_NODE) translateTree(node);
                });
            });
        });
        observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: translatedAttributes });
    }

    window.getSiteLanguage = () => currentLanguage;
    window.getSiteLocale = siteLocale;
    window.translateSiteText = translateValue;
    window.getLocalizedMenuField = localizedMenuField;
    window.getLocalizedMenuCategory = localizedCategory;
    window.setSiteLanguage = setLanguage;

    const nativeConfirm = window.confirm.bind(window);
    const nativeAlert = window.alert.bind(window);
    window.confirm = message => nativeConfirm(translateValue(message));
    window.alert = message => nativeAlert(translateValue(message));

    document.addEventListener("DOMContentLoaded", init);
})();
