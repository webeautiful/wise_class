/**
 * solve template cache problem
 * @param $provide
 */
const configureTemplateFactory = ($provide) => {
  // Set a suffix outside the decorator function
  const cacheBuster = Date.now().toString();

  const templateFactoryDecorator = ($delegate) => {
    const fromUrl = angular.bind($delegate, $delegate.fromUrl)
    $delegate.fromUrl = function (url, params) {
      if (url !== null && angular.isDefined(url) && angular.isString(url)) {
        url += (url.indexOf("?") === -1 ? "?" : "&")
        url += "v=" + cacheBuster;
      }

      return fromUrl(url, params)
    }

    return $delegate
  }

  $provide.decorator('$templateFactory', ['$delegate', templateFactoryDecorator]);
}
const templateCacheConfig = ['$provide', configureTemplateFactory]

export default templateCacheConfig
