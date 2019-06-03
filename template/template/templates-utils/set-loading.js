function setLoadingDisplay() {
  // Loading splash scene
  var splash = document.getElementById('splash');
  var progressBar = splash.querySelector('.progress-bar span');
  cc.loader.onProgress = function (completedCount, totalCount, item) {
    var percent = 100 * completedCount / totalCount;
    if (progressBar) {
      progressBar.style.width = percent.toFixed(2) + '%';
    }
  };
  splash.style.display = 'block';
  progressBar.style.width = '0%';

  cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
    // splash.style.display = 'none';
    //btnClick()
  });
}
