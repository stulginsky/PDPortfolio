#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const targets = [
  // Showcase/root page previews
  {
    bucket: "showcase",
    urls: [
      "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/69772d0b-d5ce-4de4-b2f0-e03431f0ba4a/Preview.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZPASNL4K%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T130246Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC6fwh8girvBxvzEjpwpGzhyVzSQAdj6syB2xfXzWH17AiEA6V8VY%2BbITpVfvGX70a%2FDPK0mRSsBJovendm0MxHTNS4qiAQIhv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEMMWGtEYwS9bgUg8SrcA4EkhA%2FiFAjgKdMDwbzQnX%2BuKeSeH8UOHikWvFwB%2BxGaqJu8nhY4M5ifyloq6EJ3vUHN0R18pw5Ho7O33KDegU1cUS5s2X071kHF%2FxTFSqVHsdalAkXQnxEuLL%2FOpZHuZN6K3ICTG5y2oOEKO73A9RktFfNa%2B3th1YX9a69Vp8iTLF8J1nBghECfKe7NjwKlneGP1IwfhpGrxrfqziPMac%2F%2BPJfZU3uF%2FLtuDTLFOwpCYIEqGhPNE58u2zfC8gmzyGXIqCluiZiJAdhjIcKrTPPkL4npKzMVa2LOmi%2BnZ%2Ff3Xen9S1dXcBSzfx9LdTTBTK419q1uQZzkWiVUlklfef5h1Zq2cBbpjWjDSpQcIbg2HfBlfGMmHHlPWM0jvpGbHjpAB6qjd4vVPmC2BFNrP08O6VgJec2%2FR40RPzdx9yTStZ%2FLX7hBahfiLyhbh3THwELVpiCkOMYCPPZA8jSIgAnSL196vjZKDfZABSOx%2B4w41SS3AR23oIOgExoFv5oag%2Bxjvh1c%2BbCg9q7ER6jIXcflMK1Mw0nF7aVuK6XLA%2BSL4UBBRmUjVYea38OBYiwLo4bzDmATOagy9O1mHdSgLIavtqVJu0c3Q4ldvztFDlcTV6T8m5qIpgVSAomRMPbN588GOqUB%2FGMhgihUyililbo81iVp5jEIblJMuBKS4%2BOFgQOQo%2FF5ohbqy6z0Ql7oQgz8O7V7%2Bj1Fwi6HQ2rK%2B5qD57lnmG75j0FtxwncwY61d95yg0pb4eIzk3O9IsADX%2FS9vv%2BcGEQP3f%2F6a2gWMY5lJaMpnz0jxC1H9stECTCarBwcLAzyzZIY3j2HOjq8Exhur5Z3K5Cr8F9JEdy3iRbb48Vohx%2FLFvny&X-Amz-Signature=47b267de21517142bdc4383820d81a70d2dfc75e3fefebdd218d3a20cbdb9c50&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
      "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/55d7d365-22d0-4603-a69f-cb9bb4918161/Frame_351669.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZPASNL4K%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T130246Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC6fwh8girvBxvzEjpwpGzhyVzSQAdj6syB2xfXzWH17AiEA6V8VY%2BbITpVfvGX70a%2FDPK0mRSsBJovendm0MxHTNS4qiAQIhv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEMMWGtEYwS9bgUg8SrcA4EkhA%2FiFAjgKdMDwbzQnX%2BuKeSeH8UOHikWvFwB%2BxGaqJu8nhY4M5ifyloq6EJ3vUHN0R18pw5Ho7O33KDegU1cUS5s2X071kHF%2FxTFSqVHsdalAkXQnxEuLL%2FOpZHuZN6K3ICTG5y2oOEKO73A9RktFfNa%2B3th1YX9a69Vp8iTLF8J1nBghECfKe7NjwKlneGP1IwfhpGrxrfqziPMac%2F%2BPJfZU3uF%2FLtuDTLFOwpCYIEqGhPNE58u2zfC8gmzyGXIqCluiZiJAdhjIcKrTPPkL4npKzMVa2LOmi%2BnZ%2Ff3Xen9S1dXcBSzfx9LdTTBTK419q1uQZzkWiVUlklfef5h1Zq2cBbpjWjDSpQcIbg2HfBlfGMmHHlPWM0jvpGbHjpAB6qjd4vVPmC2BFNrP08O6VgJec2%2FR40RPzdx9yTStZ%2FLX7hBahfiLyhbh3THwELVpiCkOMYCPPZA8jSIgAnSL196vjZKDfZABSOx%2B4w41SS3AR23oIOgExoFv5oag%2Bxjvh1c%2BbCg9q7ER6jIXcflMK1Mw0nF7aVuK6XLA%2BSL4UBBRmUjVYea38OBYiwLo4bzDmATOagy9O1mHdSgLIavtqVJu0c3Q4ldvztFDlcTV6T8m5qIpgVSAomRMPbN588GOqUB%2FGMhgihUyililbo81iVp5jEIblJMuBKS4%2BOFgQOQo%2FF5ohbqy6z0Ql7oQgz8O7V7%2Bj1Fwi6HQ2rK%2B5qD57lnmG75j0FtxwncwY61d95yg0pb4eIzk3O9IsADX%2FS9vv%2BcGEQP3f%2F6a2gWMY5lJaMpnz0jxC1H9stECTCarBwcLAzyzZIY3j2HOjq8Exhur5Z3K5Cr8F9JEdy3iRbb48Vohx%2FLFvny&X-Amz-Signature=26a461af40a25c976edbf008bc6835d0688c54f526737dfaf195348c96348c9d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
      "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/6b781046-68d4-49d5-af70-9fc9b311c3a0/Preview.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZPASNL4K%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T130246Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC6fwh8girvBxvzEjpwpGzhyVzSQAdj6syB2xfXzWH17AiEA6V8VY%2BbITpVfvGX70a%2FDPK0mRSsBJovendm0MxHTNS4qiAQIhv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEMMWGtEYwS9bgUg8SrcA4EkhA%2FiFAjgKdMDwbzQnX%2BuKeSeH8UOHikWvFwB%2BxGaqJu8nhY4M5ifyloq6EJ3vUHN0R18pw5Ho7O33KDegU1cUS5s2X071kHF%2FxTFSqVHsdalAkXQnxEuLL%2FOpZHuZN6K3ICTG5y2oOEKO73A9RktFfNa%2B3th1YX9a69Vp8iTLF8J1nBghECfKe7NjwKlneGP1IwfhpGrxrfqziPMac%2F%2BPJfZU3uF%2FLtuDTLFOwpCYIEqGhPNE58u2zfC8gmzyGXIqCluiZiJAdhjIcKrTPPkL4npKzMVa2LOmi%2BnZ%2Ff3Xen9S1dXcBSzfx9LdTTBTK419q1uQZzkWiVUlklfef5h1Zq2cBbpjWjDSpQcIbg2HfBlfGMmHHlPWM0jvpGbHjpAB6qjd4vVPmC2BFNrP08O6VgJec2%2FR40RPzdx9yTStZ%2FLX7hBahfiLyhbh3THwELVpiCkOMYCPPZA8jSIgAnSL196vjZKDfZABSOx%2B4w41SS3AR23oIOgExoFv5oag%2Bxjvh1c%2BbCg9q7ER6jIXcflMK1Mw0nF7aVuK6XLA%2BSL4UBBRmUjVYea38OBYiwLo4bzDmATOagy9O1mHdSgLIavtqVJu0c3Q4ldvztFDlcTV6T8m5qIpgVSAomRMPbN588GOqUB%2FGMhgihUyililbo81iVp5jEIblJMuBKS4%2BOFgQOQo%2FF5ohbqy6z0Ql7oQgz8O7V7%2Bj1Fwi6HQ2rK%2B5qD57lnmG75j0FtxwncwY61d95yg0pb4eIzk3O9IsADX%2FS9vv%2BcGEQP3f%2F6a2gWMY5lJaMpnz0jxC1H9stECTCarBwcLAzyzZIY3j2HOjq8Exhur5Z3K5Cr8F9JEdy3iRbb48Vohx%2FLFvny&X-Amz-Signature=cbef55e873ec9596dc7c084ed2b8821966304ad22e558cc780fc465a76297fab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
      "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/2c750ce5-2d92-448b-baff-635fbb1200ba/Frame_351670.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZPASNL4K%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T130246Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC6fwh8girvBxvzEjpwpGzhyVzSQAdj6syB2xfXzWH17AiEA6V8VY%2BbITpVfvGX70a%2FDPK0mRSsBJovendm0MxHTNS4qiAQIhv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEMMWGtEYwS9bgUg8SrcA4EkhA%2FiFAjgKdMDwbzQnX%2BuKeSeH8UOHikWvFwB%2BxGaqJu8nhY4M5ifyloq6EJ3vUHN0R18pw5Ho7O33KDegU1cUS5s2X071kHF%2FxTFSqVHsdalAkXQnxEuLL%2FOpZHuZN6K3ICTG5y2oOEKO73A9RktFfNa%2B3th1YX9a69Vp8iTLF8J1nBghECfKe7NjwKlneGP1IwfhpGrxrfqziPMac%2F%2BPJfZU3uF%2FLtuDTLFOwpCYIEqGhPNE58u2zfC8gmzyGXIqCluiZiJAdhjIcKrTPPkL4npKzMVa2LOmi%2BnZ%2Ff3Xen9S1dXcBSzfx9LdTTBTK419q1uQZzkWiVUlklfef5h1Zq2cBbpjWjDSpQcIbg2HfBlfGMmHHlPWM0jvpGbHjpAB6qjd4vVPmC2BFNrP08O6VgJec2%2FR40RPzdx9yTStZ%2FLX7hBahfiLyhbh3THwELVpiCkOMYCPPZA8jSIgAnSL196vjZKDfZABSOx%2B4w41SS3AR23oIOgExoFv5oag%2Bxjvh1c%2BbCg9q7ER6jIXcflMK1Mw0nF7aVuK6XLA%2BSL4UBBRmUjVYea38OBYiwLo4bzDmATOagy9O1mHdSgLIavtqVJu0c3Q4ldvztFDlcTV6T8m5qIpgVSAomRMPbN588GOqUB%2FGMhgihUyililbo81iVp5jEIblJMuBKS4%2BOFgQOQo%2FF5ohbqy6z0Ql7oQgz8O7V7%2Bj1Fwi6HQ2rK%2B5qD57lnmG75j0FtxwncwY61d95yg0pb4eIzk3O9IsADX%2FS9vv%2BcGEQP3f%2F6a2gWMY5lJaMpnz0jxC1H9stECTCarBwcLAzyzZIY3j2HOjq8Exhur5Z3K5Cr8F9JEdy3iRbb48Vohx%2FLFvny&X-Amz-Signature=11452cbc3b0d3a9e0af0014d24dc2e5c1b41b0c64d0891d8d9b6bfc6f213f6fb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
      "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/f2b49b70-859d-4dc0-aa39-f8b3f106debd/Preview.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZPASNL4K%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T130246Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC6fwh8girvBxvzEjpwpGzhyVzSQAdj6syB2xfXzWH17AiEA6V8VY%2BbITpVfvGX70a%2FDPK0mRSsBJovendm0MxHTNS4qiAQIhv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEMMWGtEYwS9bgUg8SrcA4EkhA%2FiFAjgKdMDwbzQnX%2BuKeSeH8UOHikWvFwB%2BxGaqJu8nhY4M5ifyloq6EJ3vUHN0R18pw5Ho7O33KDegU1cUS5s2X071kHF%2FxTFSqVHsdalAkXQnxEuLL%2FOpZHuZN6K3ICTG5y2oOEKO73A9RktFfNa%2B3th1YX9a69Vp8iTLF8J1nBghECfKe7NjwKlneGP1IwfhpGrxrfqziPMac%2F%2BPJfZU3uF%2FLtuDTLFOwpCYIEqGhPNE58u2zfC8gmzyGXIqCluiZiJAdhjIcKrTPPkL4npKzMVa2LOmi%2BnZ%2Ff3Xen9S1dXcBSzfx9LdTTBTK419q1uQZzkWiVUlklfef5h1Zq2cBbpjWjDSpQcIbg2HfBlfGMmHHlPWM0jvpGbHjpAB6qjd4vVPmC2BFNrP08O6VgJec2%2FR40RPzdx9yTStZ%2FLX7hBahfiLyhbh3THwELVpiCkOMYCPPZA8jSIgAnSL196vjZKDfZABSOx%2B4w41SS3AR23oIOgExoFv5oag%2Bxjvh1c%2BbCg9q7ER6jIXcflMK1Mw0nF7aVuK6XLA%2BSL4UBBRmUjVYea38OBYiwLo4bzDmATOagy9O1mHdSgLIavtqVJu0c3Q4ldvztFDlcTV6T8m5qIpgVSAomRMPbN588GOqUB%2FGMhgihUyililbo81iVp5jEIblJMuBKS4%2BOFgQOQo%2FF5ohbqy6z0Ql7oQgz8O7V7%2Bj1Fwi6HQ2rK%2B5qD57lnmG75j0FtxwncwY61d95yg0pb4eIzk3O9IsADX%2FS9vv%2BcGEQP3f%2F6a2gWMY5lJaMpnz0jxC1H9stECTCarBwcLAzyzZIY3j2HOjq8Exhur5Z3K5Cr8F9JEdy3iRbb48Vohx%2FLFvny&X-Amz-Signature=5f06b906574f97335e48a50612f23d12c07ee086b58935b58da9f3d9c542488c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
      "https://prod-files-secure.s3.us-west-2.amazonaws.com/b3f6962d-07a7-4fba-953c-063b36ec79a7/af6d3411-20d6-4672-9b6c-1ceda8662dca/Preview.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZPASNL4K%2F20260505%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260505T130246Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIC6fwh8girvBxvzEjpwpGzhyVzSQAdj6syB2xfXzWH17AiEA6V8VY%2BbITpVfvGX70a%2FDPK0mRSsBJovendm0MxHTNS4qiAQIhv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDEMMWGtEYwS9bgUg8SrcA4EkhA%2FiFAjgKdMDwbzQnX%2BuKeSeH8UOHikWvFwB%2BxGaqJu8nhY4M5ifyloq6EJ3vUHN0R18pw5Ho7O33KDegU1cUS5s2X071kHF%2FxTFSqVHsdalAkXQnxEuLL%2FOpZHuZN6K3ICTG5y2oOEKO73A9RktFfNa%2B3th1YX9a69Vp8iTLF8J1nBghECfKe7NjwKlneGP1IwfhpGrxrfqziPMac%2F%2BPJfZU3uF%2FLtuDTLFOwpCYIEqGhPNE58u2zfC8gmzyGXIqCluiZiJAdhjIcKrTPPkL4npKzMVa2LOmi%2BnZ%2Ff3Xen9S1dXcBSzfx9LdTTBTK419q1uQZzkWiVUlklfef5h1Zq2cBbpjWjDSpQcIbg2HfBlfGMmHHlPWM0jvpGbHjpAB6qjd4vVPmC2BFNrP08O6VgJec2%2FR40RPzdx9yTStZ%2FLX7hBahfiLyhbh3THwELVpiCkOMYCPPZA8jSIgAnSL196vjZKDfZABSOx%2B4w41SS3AR23oIOgExoFv5oag%2Bxjvh1c%2BbCg9q7ER6jIXcflMK1Mw0nF7aVuK6XLA%2BSL4UBBRmUjVYea38OBYiwLo4bzDmATOagy9O1mHdSgLIavtqVJu0c3Q4ldvztFDlcTV6T8m5qIpgVSAomRMPbN588GOqUB%2FGMhgihUyililbo81iVp5jEIblJMuBKS4%2BOFgQOQo%2FF5ohbqy6z0Ql7oQgz8O7V7%2Bj1Fwi6HQ2rK%2B5qD57lnmG75j0FtxwncwY61d95yg0pb4eIzk3O9IsADX%2FS9vv%2BcGEQP3f%2F6a2gWMY5lJaMpnz0jxC1H9stECTCarBwcLAzyzZIY3j2HOjq8Exhur5Z3K5Cr8F9JEdy3iRbb48Vohx%2FLFvny&X-Amz-Signature=1ff694e46239629e9148e656ef500f206985463b12b23c6caeff345123322174&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
    ]
  }
];

function extFromUrl(url) {
  try {
    const ext = path.extname(new URL(url).pathname).toLowerCase();
    return ext || ".img";
  } catch {
    return ".img";
  }
}

function hash(input) {
  return createHash("sha1").update(input).digest("hex").slice(0, 10);
}

async function main() {
  const publicDir = path.resolve("public/notion-assets");
  let downloaded = 0;
  for (const target of targets) {
    const dir = path.join(publicDir, target.bucket);
    await fs.mkdir(dir, { recursive: true });
    for (let i = 0; i < target.urls.length; i += 1) {
      const url = target.urls[i];
      const ext = extFromUrl(url);
      const filename = `img-${String(i + 1).padStart(2, "0")}-${hash(url)}${ext}`;
      const filePath = path.join(dir, filename);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        await fs.writeFile(filePath, buf);
        downloaded += 1;
      } catch (err) {
        console.warn(`skip ${target.bucket}: ${err.message}`);
      }
    }
  }
  console.log(`Downloaded ${downloaded} extra images`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
