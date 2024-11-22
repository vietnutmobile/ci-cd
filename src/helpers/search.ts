const change_alias_lv1 = (alias: string) => {
  var str = alias || '';
  str = str.toLowerCase();
  return str;
};

const change_alias_lv2 = (alias: string) => {
  var str = alias || '';
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả/g, 'a');
  str = str.replace(/ầ|ấ|ậ|ẩ|ẫ/g, 'â');
  str = str.replace(/ằ|ắ|ặ|ẳ|ẵ/g, 'ă');
  str = str.replace(/è|é|ẹ|ẻ/g, 'e');
  str = str.replace(/ề|ế|ệ|ể|ễ/g, 'ê');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ/g, 'o');
  str = str.replace(/ồ|ố|ộ|ổ|ỗ/g, 'ô');
  str = str.replace(/ờ|ớ|ợ|ở|ỡ/g, 'ơ');
  str = str.replace(/ù|ú|ụ|ủ|ũ/g, 'u');
  str = str.replace(/ừ|ứ|ự|ử|ữ/g, 'ư');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|=|<|>|\?|\/|,|\.|:|;|'|"|&|#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' ',
  );
  str = str.replace(/ + /g, ' ');
  str = str.trim();
  return str;
};

export const change_alias_lv3 = (alias: string) => {
  var str = alias || '';
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|=|<|>|\?|\/|,|\.|:|;|'|"|&|#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' ',
  );
  str = str.replace(/ + /g, ' ');
  str = str.trim();
  return str;
};

export type SearchType = {
  nameLevel1: string;
  nameLevel2: string;
  nameLevel3: string;
};

export function convert_data<T>(data: Array<any>, feild: keyof T): Array<T> {
  return data.map((item) => ({
    ...item,
    nameLevel1: change_alias_lv1(item[feild] as string),
    nameLevel2: change_alias_lv2(item[feild] as string),
    nameLevel3: change_alias_lv3(item[feild] as string),
  }));
}

export function smart_search(data: Array<any>, name: string): Array<any> {
  name = name.toLowerCase();
  const hasDiacritics = /[àáảãạầấẩẫậằắẳẵặèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/.test(name);
  const hasVariant = /[âăêôơưđ]/.test(name);

  const level = hasDiacritics ? 'nameLevel1' : hasVariant ? 'nameLevel2' : 'nameLevel3';

  return data
    .filter((item) => item[level].includes(name))
    .map((item) => ({ ...item, score: item[level].indexOf(name) }))
    .sort((a, b) => a.score - b.score);
}
