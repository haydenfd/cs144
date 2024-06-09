export function computeHexLuminance(hexCode) {
    hexCode = hexCode.replace(/^#/, '');
    let r = parseInt(hexCode.substring(0, 2), 16) / 255;
    let g = parseInt(hexCode.substring(2, 4), 16) / 255;
    let b = parseInt(hexCode.substring(4, 6), 16) / 255;

    let luminance_rating = 0.21 * r + 0.72 * g + 0.07 * b;
    
    // perceived light
    if (luminance_rating > 0.5) {
        return "light";
    }
    else {
        return "dark";
    }
}

export function isValidRGBFormat(rgb) {
    var rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
    
    var match = rgb.match(rgbRegex);
    
    if (match) {
        var r = parseInt(match[1]);
        var g = parseInt(match[2]);
        var b = parseInt(match[3]);
        
        if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
            return true;
        }
    }
    return false;
}
  
export function rgbToHex(rgb) {
    var result = rgb.match(/\d+/g);
      var r = parseInt(result[0]);
    var g = parseInt(result[1]);
    var b = parseInt(result[2]);
    
    var hexR = r.toString(16).padStart(2, '0');
    var hexG = g.toString(16).padStart(2, '0');
    var hexB = b.toString(16).padStart(2, '0');
    
    return '#' + hexR + hexG + hexB;
}
  