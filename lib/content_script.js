var wunderlistIcon = chrome.extension.getURL('img/icon48.png');
var WunderlistSDK = wunderlist.sdk;

$('.recipe-sidebar-details')
  .append(`
    <a class="export-btn">
      <img src="${wunderlistIcon}">
      <span>Export to Wunderlist</span>
    </a>`);

$('.export-btn')
  .on('click', () => {
    console.log(serializeRecipe());
  });

var serializeRecipe = () => {
  return $('li[itemprop="ingredients"]').map((i, ingredient) => {
    return $(ingredient).text();
  });
};

var WunderlistAPI = new WunderlistSDK({
  accessToken: '52188ada1ecd003e8cb8778e560b057828038b01ebb5e56c44d402242d77',
  clientID: 'b8082b4c0e661f5eae9c'
});

WunderlistAPI.initialized.done(() => {
  return Wunde
})
