import { z } from 'zod';

export const doctorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters / 이름은 2자 이상이어야 합니다'),
  specialties: z.array(z.string()).min(1, 'Please select at least one specialty / 최소 1개의 전문 분야를 선택해주세요'),
  providesUrgentCare: z.boolean(),
  hospital: z.string().min(1, 'Hospital name is required / 병원 이름을 입력해주세요'),
  hospitalAddress: z.string().min(3, "Address must be at least 3 characters"),
});


export const hospitalSchema = z.object({
  name: z.string().min(2, 'Hospital name must be at least 2 characters / 병원 이름은 2자 이상이어야 합니다'),
  address: z.string().min(5, 'Please enter a detailed address / 상세 주소를 입력해주세요'),
  specialties: z.array(z.string()).min(1, 'Please select at least one specialty / 최소 1개의 전문 분야를 선택해주세요'),
  providesUrgentCare: z.boolean(),
  operatingHours: z.string().min(1, 'Please enter operating hours / 운영 시간을 입력해주세요'),
  hospitalType: z.string().min(1, 'Hospital type is required')
});
