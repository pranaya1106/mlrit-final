import * as migration_20261006_083430_initial from './20261006_083430_initial';
import * as migration_20261006_084423_gallery_columns from './20261006_084423_gallery_columns';
import * as migration_20261019_061412_s3_storage from './20261019_061412_s3_storage';
import * as migration_20261104_125754_examinations_circulars_media from './20261104_125754_examinations_circulars_media';
import * as migration_20261110_062720_faculty_cms from './20261110_062720_faculty_cms';
import * as migration_20261110_faculty_seed from './20261110_faculty_seed';
import * as migration_20261110_october_circulars from './20261110_october_circulars';

export const migrations = [
  {
    up: migration_20261006_083430_initial.up,
    down: migration_20261006_083430_initial.down,
    name: '20261006_083430_initial',
  },
  {
    up: migration_20261006_084423_gallery_columns.up,
    down: migration_20261006_084423_gallery_columns.down,
    name: '20261006_084423_gallery_columns',
  },
  {
    up: migration_20261019_061412_s3_storage.up,
    down: migration_20261019_061412_s3_storage.down,
    name: '20261019_061412_s3_storage',
  },
  {
    up: migration_20261104_125754_examinations_circulars_media.up,
    down: migration_20261104_125754_examinations_circulars_media.down,
    name: '20261104_125754_examinations_circulars_media',
  },
  {
    up: migration_20261110_062720_faculty_cms.up,
    down: migration_20261110_062720_faculty_cms.down,
    name: '20261110_062720_faculty_cms',
  },
  {
    up: migration_20261110_faculty_seed.up,
    down: migration_20261110_faculty_seed.down,
    name: '20261110_faculty_seed',
  },
  {
    up: migration_20261110_october_circulars.up,
    down: migration_20261110_october_circulars.down,
    name: '20261110_october_circulars',
  },
];

