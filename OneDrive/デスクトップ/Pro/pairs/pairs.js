jQuery(function($){

  class Card{
    constructor(mark, number){
          this.mark = mark;
          this.number = number;
    }
  };


   const cards=[];
   const init = function(){
     let x=0;
     for(let i=1;i <= 13;i++){
       cards[x] = new Card("s", i);
       x++;
       cards[x] = new Card("c", i);
       x++;
       cards[x] = new Card("h", i);
       x++;
       cards[x] = new Card("d", i);
       x++;
     };
   }; init();

   const shuffle = function(){

     for(let i=1; i<500; i++){
     let rand1 = Math.floor( Math.random()* 52 );
     let rand2 = Math.floor( Math.random()* 52);
     let cardRand = cards[rand1];
     cards[rand1] = cards[rand2];
     cards[rand2] = cardRand;
      };

   };

   shuffle();



   const getCardFileName = function(mark, number){

      if(number < 10){
        number= ("00" + number).slice(-2);
        }
        return mark + number;
   };

   const getCardFileNameByCard= function(Card){
     return getCardFileName(Card.mark, Card.number) + ".png";
};

//cardIdを作る


const cardId = function(Card){

  return getCardFileName(Card.mark, Card.number);
};

//修正版renderOneCard
    const renderOneCard = function(card, isFaced){

      $('#cards').append('<li><img src="" id ="" class="card cards" alt=""></li>');
      $('.card').attr("id", cardId(card));
      if(isFaced){
      $('.card').attr("src", getCardFileNameByCard(card));
    }else{
      $('.card').attr("src", "z02.png");
    }
      $('.cards').removeClass("card");
   };


// 課題F　全カード一覧表示　renderOneCard
   const renderAllCards = function(){
     for(let i=0; i< cards.length ; i++){
       renderOneCard(cards[i]);
     };

   };

   // 裏向きにする関数

     const faceDownCard = function(cardId){
         $("#" + cardId).attr("src", "z02.png");
         $("#" + cardId).removeClass("omote");

     };

   // 表向きにする関数

     const faceUpCard = function(cardId){
       let cardInfo = cardId + ".png";
       $("#" + cardId).attr("src", cardInfo);
       $("#" + cardId).addClass("omote");
     };

   // idで裏表を判定＆逆向き

   const flipCard = function(cardId){
     let cardSelf = "#" + cardId;
     if($(cardSelf).hasClass("omote")){
       faceDownCard(cardId);
     }else{
       faceUpCard(cardId);
     }

   };

   //cardIdの入った配列

   const cardIdList = [];
   let x = 0;
   for(let i = 0; i< cards.length; i++){
     cardIdList[x] = cardId(cards[i]);
     x++
   };

   // 複数のカードを同時に表にする関数

   const faceUpCardList = function(cardIdList){
     for(let i = 0; i<cardIdList.length; i++){
       faceUpCard(cardIdList[i]);
     }
   };

   // 複数のカードを同時に裏にする関数

   const faceDownCardList = function(cardIdList){
     for(let i = 0; i<cardIdList.length; i++){
       faceDownCard(cardIdList[i]);
     }
   };

   // 表を向いているカードの枚数を返す関数

   const getOpenCardCount = function(){
     let omotes = $('.omote').length;
     return omotes;
   };

   getOpenCardCount();

   // getOpenCardCount の結果を表示する関数

   const showOpenCardCount = function(){
     let words = "表の数 : " + getOpenCardCount();
      $('.omote-cards').text(words);
      $('.omote-cards').css('border', '5px dotted white');
   };

   // getOpenCardCountが変化したときにshowOpenCardCountを呼び出す
   // getOpenCardCountが変化するときとはどういうときか。=> omoteクラス変化。

   // cardId1,2の数字部分が一致するときにtrue,しなければfalse

   const isSameNumber = function(cardId1, cardId2){
     let idNum1 = cardId1.slice(-2);
     let idNum2 = cardId2.slice(-2);
     return (idNum1 === idNum2);

   };


   // getOpenCardCountの戻り値を利用して、条件分岐を含むtryOpenCardという関数

   const tryOpenCard = function(cardId){
     if(getOpenCardCount() < 2 ){
       faceUpCard(cardId);
       let idOne = $('.omote').attr('id');
       let idTwo = $('.omote').eq(1).attr('id');
       if(getOpenCardCount() === 2){
         if(isSameNumber(idOne, idTwo)){
          successMatch();
         }else{
          failureMatch();
         };

       };
     };


   };


   // 表を向いているカードをすべて場から取り除く関数

    const removeCards = function(){
      let pairs = $('.omote');
      $(pairs).removeClass('omote');
      $(pairs).addClass('outside');
      $('.outside').css("visibility", 'hidden');


//      let idTwo = $('.omote').eq(1).css("visibility", 'hidden');
    };

    // 500ミリ秒待機してremoveCardsを呼ぶ関数

    const watingTime = 500;


    const successMatch = function(){
      setTimeout(function(){
        removeCards();
        addScore(currentPlayerIndex);
        onStageChange();

        // ゲーム終了時の処理
        let remainingCards = $('.cards:not(.outside)').length;
        if(remainingCards === 0){
          if($('.top').length === 0){
            $('.manage').append('<h1>～～～引き分け～～～</h1>');
          }else{
          let winners = $('.top').text();
          $('.manage').append('<h1 class="winnerMassage"></h1>');
          $('.winnerMassage').text(winners);
        };

        };
      }, watingTime);
    };

    // 表向いてるカードを裏に向ける

    const revertCards = function(){
//      let idOne = $('.omote').attr('id');
//      let idTwo = $('.omote').eq(1).attr('id');
      $('.omote').each(function(index){
        let omoteIds = $(this).attr('id');
        faceDownCard(omoteIds);
      })
    };


    // 500ミリ待機してrevertCards を呼ぶ関数

    const failureMatch = function(){
      setTimeout(function(){
        changePlayer();
        revertCards();
        onStageChange();
      }, watingTime);
    };



    // 状態が変わったらまとめて行う処理

    const onStageChange = function(){
      showAllPlayersStatus();
      compareScores();
      getRemainingCardCount();
    };

    //プレイヤー人数

    let numberOfPlayers = 2;

    // 各プレイやーの得点の配列

    let playerScoreList = [];

    //現在のプレイヤーのindex番号

    let currentPlayerIndex = 0;

    // 各プレイヤーのスコアを初期化する関数

    const initScore = function(){
      $('.manage').append('<div class="scores"></div>');
      for(let i = 0; i < numberOfPlayers; i++){
        playerScoreList[i] = 0;
        $('.scores').append('<li class="score"></li><br>');
      };
    };

    initScore();

    // 次のプレイヤーを示す数値に変化させる



      const changePlayer = function(){
        currentPlayerIndex++;
        if(currentPlayerIndex >= numberOfPlayers){
          currentPlayerIndex = 0;
        };
        $('.current').css('color', 'white');
        $('.score').removeClass('current');
      };

      // プレイヤーのスコアを加算する

      const addScore = function(playerIndex){

        playerScoreList[playerIndex]++;
      };


      // 全員同一か否かを最大値最小値で。

      const compareScores = function(i){

        // 一番大きい数値
        let scoreMax = 0;
        for(let i=0; i<playerScoreList.length; i++){
          if(playerScoreList[i] > scoreMax){
          scoreMax = playerScoreList[i];
          };
        };

        // 一番小さい数値
        let scoreMin;
        for(let i=0; i<playerScoreList.length; i++){
          if(playerScoreList[i] < scoreMin || scoreMin===undefined){
          scoreMin = playerScoreList[i];
          };
        };



        let playerNumber  = i+1;
        let topEffect = '  ★top★  ';

        if(scoreMax != scoreMin){
          if(playerScoreList[i] == scoreMax){
          $('.score').eq(i).text( "player" + playerNumber + " : " + scoreMax + topEffect);
          $('.score').eq(i).addClass('top');
        }else{
          $('.score').eq(i).removeClass('top');
        };
      }else{
        $('.score').eq(i).removeClass('top');
        $('.score').eq(i).text("player" + playerNumber + " : " + playerScoreList[i]);
      };

    };




// currentPlayerクラスをつけて、それにCSSをつける


      const showAllPlayersStatus = function(){
        let currentPlayerNumber = currentPlayerIndex + 1;
        $('.currentPlayer').text('currentPlayer : ' + currentPlayerNumber);
        let MaxScore = playerScoreList.reduce((a,b)=>Math.max(a,b));

        // スコア一覧
        for(let i = 0; i < numberOfPlayers; i++){
          let playerNumber  = i+1;
          $('.score').eq(i).text("player" + playerNumber + " : " + playerScoreList[i]);
          let nowPlay = $('.score').eq(i);
          if(currentPlayerIndex === i){
            $('.score').eq(i).addClass('current');
            $('.current').css('color', 'red');

          };

        // ハイスコアプレイヤー
        compareScores(i);

    };

  };

        // 場に出ているカードの枚数をカウントする関数


        const getRemainingCardCount = function(){
          let textRemainingCards = "カード残数 : " +   $('.cards:not(.outside)').length;
          $('.omote-cards').text(textRemainingCards);
          $('.omote-cards').css('border', '5px dotted white');
        };
























// 全てのカードを表示するボタン

  $('.start').click(function(){

   renderAllCards();
   $('.manage').append('<div class="currentPlayer">');

   onStageChange();
   $('.start').hide();

   $('.cards').click(function(){
     let id = $(this).attr('id');
    tryOpenCard(id);
    onStageChange();



   });


  });


// 今後直したいこと
// 一回successした後、クリックが利かなくなる
// A. getOpenCardCountはomoteクラスの枚数を数えているから、successMatch終わった後はそろったカードからはomoteクラスを取り上げる
// 一回オープンし、裏に戻ったあと、getOpenCardCountの数値が２のまま。
// 画面の状態が変わることを真偽値で表す


});
