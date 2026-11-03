// Original Figma3344:2470 card frames. Prototype moveback shares the Default target.
// Corresponding silhouette anchors from unchanged PNGs: sight tip, stock edge, magazine tip.
export const weaponPoseAnchors = [
  {
    "ax": 345.5,
    "ay": 96.3,
    "bx": 628.5217391304348,
    "by": 366.60869565217394,
    "cx": 447.04,
    "cy": 467.64
  },
  {
    "ax": 253.31578947368422,
    "ay": 117.3157894736842,
    "bx": 704.5,
    "by": 346.2142857142857,
    "cx": 435.05263157894734,
    "cy": 466.63157894736844
  },
  {
    "ax": 195.65384615384616,
    "ay": 127.3076923076923,
    "bx": 764.5,
    "by": 336.3333333333333,
    "cx": 429.8,
    "cy": 462.6
  },
  {
    "ax": 160.76923076923077,
    "ay": 129.34615384615384,
    "bx": 809.7333333333333,
    "by": 332.8,
    "cx": 428.3333333333333,
    "cy": 457.6
  },
  {
    "ax": 140.66666666666666,
    "ay": 128.41666666666666,
    "bx": 842.6,
    "by": 332.7,
    "cx": 428.7692307692308,
    "cy": 453.61538461538464
  },
  {
    "ax": 129.76923076923077,
    "ay": 126.34615384615384,
    "bx": 863.7333333333333,
    "by": 334.46666666666664,
    "cx": 429.45454545454544,
    "cy": 450.54545454545456
  },
  {
    "ax": 123.73913043478261,
    "ay": 124.47826086956522,
    "bx": 876.6428571428571,
    "by": 335.92857142857144,
    "cx": 430.3,
    "cy": 448.5
  },
  {
    "ax": 121.30434782608695,
    "ay": 123.52173913043478,
    "bx": 883.5454545454545,
    "by": 337.09090909090907,
    "cx": 431,
    "cy": 447.6666666666667
  },
  {
    "ax": 120.5,
    "ay": 123.33333333333333,
    "bx": 885.7142857142857,
    "by": 337.64285714285717,
    "cx": 431.42857142857144,
    "cy": 446.64285714285717
  }
] as const
export const weaponProfiles = [
  {
    "name": "base",
    "width": 288,
    "height": 500,
    "stripe": {
      "x": 56,
      "y": 0,
      "w": 176,
      "h": 500
    },
    "states": [
      {
        "name": "Default",
        "source": "3344:2471",
        "weapon": {
          "x": -263,
          "y": -40,
          "w": 813,
          "h": 486
        }
      },
      {
        "name": "Hover",
        "source": "3344:2485",
        "weapon": {
          "x": -316,
          "y": -69,
          "w": 813,
          "h": 485
        }
      },
      {
        "name": "ActivePressed",
        "source": "3344:2498",
        "weapon": {
          "x": -236,
          "y": -8,
          "w": 667,
          "h": 398
        }
      }
    ]
  },
  {
    "name": "min-768",
    "width": 430,
    "height": 532,
    "stripe": {
      "x": 111,
      "y": 0,
      "w": 208,
      "h": 532
    },
    "states": [
      {
        "name": "Default",
        "source": "3344:2523",
        "weapon": {
          "x": -266,
          "y": -46,
          "w": 945,
          "h": 564
        }
      },
      {
        "name": "Hover",
        "source": "3344:2537",
        "weapon": {
          "x": -579,
          "y": -192,
          "w": 1347,
          "h": 804
        }
      },
      {
        "name": "ActivePressed",
        "source": "3344:2550",
        "weapon": {
          "x": -274,
          "y": -45,
          "w": 855,
          "h": 510
        }
      }
    ]
  }
] as const
export const weaponFrames = [
  {
    "src": "frame-01.png",
    "hash": "bfeff13786aabe1b97cf06ffcd62be278dcc1206"
  },
  {
    "src": "frame-02.png",
    "hash": "3d595aa7ffaadf7097fe038dc34fce8d2d2a5080"
  },
  {
    "src": "frame-03.png",
    "hash": "9bc89869dcccd1c0bcf6f6378b95f80af376cd1d"
  },
  {
    "src": "frame-04.png",
    "hash": "78e1da3e637908948a820de272e7c2f552c58d5e"
  },
  {
    "src": "frame-05.png",
    "hash": "033d00da0dfa789633d06b5e65fbc39831c1fefc"
  },
  {
    "src": "frame-06.png",
    "hash": "f795009732ddfff5ca5b7a602abd70b771750d99"
  },
  {
    "src": "frame-07.png",
    "hash": "39fde27a6649c2c866402abd5d744caf59fca171"
  },
  {
    "src": "frame-08.png",
    "hash": "9d9a90a4a3a4b76470546af7004a9f3bb0cd8900"
  },
  {
    "src": "frame-09.png",
    "hash": "915d21578f5f75c7f3f374809be7243018c3975c"
  }
] as const
