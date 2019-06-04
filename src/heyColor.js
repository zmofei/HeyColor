class HeyColor {
  constructor(image, config = {}) {
    this.image = image;
    this.definition = config.definition || 40;
    this.colorLength = 10;
    this.getImageData();
  }

  // crate canvas and get image data from canvas
  getImageData() {
    console.time(1)
    const imgW = this.image.width;
    const imgH = this.image.height;
    let cavsW = imgW;
    let cavsH = imgH;
    if (imgW > imgH) {
      cavsW = Math.min(500, imgW);
      cavsH = Math.min(500 * imgH / imgW, imgH);
    } else {
      cavsW = Math.min(500 * imgW / imgH, imgW);
      cavsH = Math.min(500, imgH);
    }

    const canvas = document.createElement('canvas');
    canvas.width = cavsW;
    canvas.height = cavsH;
    const ctx = canvas.getContext('2d');
    console.timeEnd(1)
    console.time(2)
    ctx.drawImage(this.image, 0, 0, imgW, imgH, 0, 0, cavsW, cavsH);
    console.timeEnd(2)
    console.time(3)
    this.imageDate = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    console.timeEnd(3)
    console.time(4)
    this.analysisColor();
    console.timeEnd(4)

  }

  analysisColor() {
    const imageDate = this.imageDate;
    const data = imageDate.data;
    const colorAnalys = [];
    // 
    console.time(1.1)
    const GDefinition = this.definition * 1.5;
    const BDefinition = this.definition * 2;
    const filterRVale = 40 / this.definition;
    const filterGVale = 40 / GDefinition;
    const filterBVale = 40 / BDefinition;
    for (let i = 0; i < data.length; i += 4) {
      const R = data[i];
      const G = data[i + 1];
      const B = data[i + 2];
      const _R = parseInt(data[i] / this.definition);
      const _G = parseInt(data[i + 1] / GDefinition);
      const _B = parseInt(data[i + 2] / BDefinition);
      if (
        _R < filterRVale && _G < filterGVale ||
        _G < filterGVale && _B < filterBVale ||
        _R < filterRVale && _B < filterBVale
      ) {
        continue;
      }
      const ColorID = `${_R}_${_G}_${_B}`;
      // for human eye
      colorAnalys[ColorID] = colorAnalys[ColorID] || {
        colorRGB: [R, G, B],
        colors: [],
        count: 0
      };
      colorAnalys[ColorID].count += 1;
    }
    console.timeEnd(1.1)


    console.time(1.2)
    const colorAnalysArr = [];
    Object.keys(colorAnalys).forEach(key => {
      const RGB = colorAnalys[key].colorRGB;
      RGB.push(colorAnalys[key].count);
      colorAnalysArr.push(RGB)
    });
    console.timeEnd(1.2)

    console.time(1.3)
    colorAnalysArr.sort((a, b) => b[3] - a[3]);
    this.mainColor = colorAnalysArr[0];
    this.colorAnalysArr = colorAnalysArr;
    console.timeEnd(1.3)
  }

  getPattern(number = 10) {
    const colorAnalysArr = this.colorAnalysArr;
    // Gets the color with the largest difference(r, g, b)
    // and sort by that color
    const analyRGB = [
      { max: 0, min: Infinity, index: 0 },
      { max: 0, min: Infinity, index: 1 },
      { max: 0, min: Infinity, index: 2 }
    ];
    for (let i = 0; i < colorAnalysArr.length; i += 1) {
      const colorRGB = colorAnalysArr[i];
      for (let s = 0; s < 3; s++) {
        analyRGB[s].min = Math.min(analyRGB[s].min, colorRGB[s]);
        analyRGB[s].max = Math.max(analyRGB[s].max, colorRGB[s]);
      }
    }

    analyRGB.sort((a, b) => (b.max - b.min) - (a.max - a.min));
    const sortIndex = analyRGB[0].index;
    colorAnalysArr.sort((a, b) => b[sortIndex] - a[sortIndex]);

    // split color list 
    let colorSet = [];
    const colorLength = Math.min(number, colorAnalysArr.length);
    for (let i = 0; i < colorLength; i++) {
      const start = Math.round((colorAnalysArr.length / colorLength) * (i));
      const end = Math.round((colorAnalysArr.length / colorLength) * (i + 1)) - 1;
      colorSet.push(colorAnalysArr.slice(start, end));
    }
    colorSet = colorSet.map(colors => {
      return colors.sort((a, b) => b[3] - a[3])[0];
    });
    return colorSet.map(c => c.slice(0, 3));
  }

  getMainColor() {
    return this.mainColor.slice(0, 3);
  }
}

export default HeyColor;