import * as yup from 'yup'
const yupNumReq = yup.lazy((value) =>
  value === ''
    ? yup.string().required('This field is required')
    : yup
        .number()
        .positive('Must be a positive number')
        .required('This field is required')
)
const yupNum = yup.lazy((value) =>
  value === ''
    ? yup.string()
    : yup.number().positive('Must be a positive number')
)
const yupDate = yup.lazy((value) =>
  value === ''
    ? yup.string().required('This field is required')
    : yup.date().required('This field is required').nullable()
)
const yupDateNotReq = yup.lazy((value) =>
  value === ''
    ? yup.string()
    : yup.date().required('This field is required').nullable()
)
const yupArray = yup.lazy((value) =>
  value === ''
    ? yup.string().required('This field is required')
    : yup.array().required('This field is required')
)

const yupString = yup.string().trim().nullable()
const yupStringReq = yup.string().trim().required('This field is required')

//////////////////////////////////////////////////////////////////////////////////
export const LoginFormYup = yup.object().shape({
  username: yupStringReq,
  password: yupStringReq,
})
export const LoginDefaultValues = {
  username: '',
  password: '',
}
export interface LoginForm {
  username: string
  password: string
}

export const ChangePasswordFormYup = yup.object().shape({
  oldPassword: yupStringReq,
  newPassword: yup
    .string()
    .trim()
    .required('New Password is required')
    .min(8, 'New Password must be atleast 8 characters'),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref('newPassword'), null],
      'New Password and Confirm Password do not match'
    ),
})
export const ChangePasswordDefaultValues = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
}
export interface ChangePasswordForm {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export const AccountFormYup = yup.object().shape({
  username: yup
    .string()
    .trim()
    .required('This field is required')
    .min(6, 'username required at least 6 characters'),
  firstName: yupStringReq,
  middleName: yupString,
  lastName: yupStringReq,
  role: yupStringReq,
  branchId: yupNumReq,
})

export const AccountDefaultValues = {
  username: '',
  firstName: '',
  middleName: '',
  lastName: '',
  role: '',
  branchId: '',
}
export interface AccountForm {
  username: string
  firstName: string
  middleName: string
  lastName: string
  role: string
  branchId: number
}

export const AccountUpdateFormYup = yup.object().shape({
  firstName: yupStringReq,
  middleName: yupString,
  lastName: yupStringReq,
  role: yupStringReq,
  branchId: yupNumReq,
  password: yup.string().trim(),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref('password'), null],
      'Password and Confirm Password do not match'
    ),
})
export const AccountUpdateDefaultValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  role: '',
  branchId: '',
  password: '',
  confirmPassword: '',
  isActive: '',
}
export interface AccountUpdateForm {
  firstName: string
  middleName: string
  lastName: string
  isActive: string
  role: string
  branchId: number
}

export const BranchAccountFormYup = yup.object().shape({
  username: yup
    .string()
    .trim()
    .required('This field is required')
    .min(6, 'username required at least 6 characters'),
  firstName: yupStringReq,
  middleName: yupString,
  lastName: yupStringReq,
  role: yupStringReq,
})

export const BranchAccountDefaultValues = {
  username: '',
  firstName: '',
  middleName: '',
  lastName: '',
  role: '',
}
export interface BranchAccountForm {
  username: string
  firstName: string
  middleName: string
  lastName: string
  role: string
}
export const BranchAccountUpdateFormYup = yup.object().shape({
  username: yup
    .string()
    .trim()
    .required('This field is required')
    .min(6, 'username required at least 6 characters'),
  firstName: yupStringReq,
  middleName: yupString,
  lastName: yupStringReq,
  role: yupStringReq,
})

export const BranchAccountUpdateDefaultValues = {
  username: '',
  firstName: '',
  middleName: '',
  lastName: '',
  role: '',
}
export interface BranchAccountUpdateForm {
  username: string
  firstName: string
  middleName: string
  lastName: string
  role: string
}

export const CaseFormYup = yup.object().shape({
  caseStatus: yupString,
  requestId: yupNum,
  requestSummary: yupString,
  Background: yup.object().shape({
    firstName: yupStringReq,
    middleName: yupString,
    lastName: yupStringReq,
    nickname: yupString,
    age: yupNumReq,
    sex: yupStringReq,
    civilStatus: yupStringReq,
    birthDate: yupDate,
    phone: yupString,
    occupationId: yupNum,
    address: yupString,
    street: yupString,
    brgy_code: yupNumReq,
    city_code: yupNumReq,
    province_code: yupNumReq,
    religionId: yupNum,
    educationId: yupNum,
    incomeId: yupNum,
    Family: yup.array().of(
      yup.object().shape({
        firstName: yupStringReq,
        middleName: yupString,
        lastName: yupStringReq,
        age: yupNumReq,
        educationId: yupNum,
        incomeId: yupNum,
        occupationId: yupNum,
      })
    ),
  }),
})
export interface CaseForm {
  caseStatus: 'pending' | 'incomplete'
  requestId: number
  requestSummary: string
  Background: {
    firstName: string
    middleName?: string
    lastName: string
    nickname?: string
    age: number
    sex: string
    civilStatus: string
    phone?: string
    birthDate: Date
    occupationId?: number
    address?: string
    street?: string
    brgy_code?: number
    city_code?: number
    province_code?: number
    religionId?: number
    educationId?: number
    incomeId?: number
    Family?: {
      firstName: string
      middleName?: string
      lastName: string
      age: number
      educationId?: number
      incomeId?: number
      occupationId?: number
    }[]
  }
}
export const CaseDefaultValues = {
  caseStatus: 'pending',
  requestId: '',
  requestSummary: '',
  Background: {
    firstName: '',
    middleName: '',
    lastName: '',
    nickname: '',
    age: '',
    sex: '',
    civilStatus: '',
    phone: '',
    birthDate: '',
    occupationId: '',
    address: '',
    street: '',
    brgy_code: '',
    city_code: '',
    province_code: '',
    religionId: '',
    educationId: '',
    incomeId: '',
    Family: [
      {
        firstName: '',
        middleName: '',
        lastName: '',
        age: '',
        educationId: '',
        incomeId: '',
        occupationId: '',
      },
    ],
  },
}

export const CaseFormUpdateYup = yup.object().shape({
  caseStatus: yupString,
  requestId: yupNum,
  requestSummary: yupString,
  Background: yup.object().shape({
    firstName: yupStringReq,
    middleName: yupString,
    lastName: yupStringReq,
    nickname: yupString,
    age: yupNumReq,
    sex: yupStringReq,
    civilStatus: yupStringReq,
    birthDate: yupDate,
    phone: yupString,
    occupationId: yupNum,
    address: yupString,
    street: yupString,
    brgy_code: yupNum,
    city_code: yupNum,
    province_code: yupNum,
    religionId: yupNum,
    educationId: yupNum,
    incomeId: yupNum,
    Family: yup.array().of(
      yup.object().shape({
        id: yupNumReq,
        firstName: yupStringReq,
        middleName: yupString,
        lastName: yupStringReq,
        age: yupNumReq,
        educationId: yupNum,
        incomeId: yupNum,
        occupationId: yupNum,
      })
    ),
  }),
})
export interface CaseUpdateForm {
  caseStatus: 'incomplete' | 'pending'
  requestId: number
  requestSummary: string
  Background: {
    firstName: string
    middleName?: string
    lastName: string
    nickname?: string
    age: number
    sex: string
    civilStatus: string
    phone?: string
    birthDate: Date
    occupationId?: number
    address?: string
    street?: string
    brgy_code?: number
    city_code?: number
    province_code?: number
    religionId?: number
    educationId?: number
    incomeId?: number
    Family?: {
      id: number
      firstName: string
      middleName?: string
      lastName: string
      age: number
      educationId?: number
      incomeId?: number
      occupationId?: number
    }[]
  }
}
export const CaseUpdateDefaultValues = {
  caseStatus: '',
  requestId: '',
  requestSummary: '',
  Background: {
    firstName: '',
    middleName: '',
    lastName: '',
    nickname: '',
    age: '',
    sex: '',
    civilStatus: '',
    phone: '',
    birthDate: '',
    occupationId: '',
    address: '',
    street: '',
    brgy_code: '',
    city_code: '',
    province_code: '',
    religionId: '',
    educationId: '',
    incomeId: '',
    Family: [
      {
        id: '',
        firstName: '',
        middleName: '',
        lastName: '',
        age: '',
        educationId: '',
        incomeId: '',
        occupationId: '',
      },
    ],
  },
}

export const EducationFormYup = yup.object().shape({
  educationName: yupStringReq,
})
export const EducationDefaultValues = {
  educationName: '',
}
export interface EducationForm {
  educationName: string
}

export const IncomeFormYup = yup.object().shape({
  from: yupNumReq,
  to: yupNumReq,
})
export interface IncomeForm {
  from: number
  to: number
}
export const IncomeDefaultValues = {
  from: '',
  to: '',
}

export const OccupationFormYup = yup.object().shape({
  occupationName: yupStringReq,
})
export interface OccupationForm {
  title: string
}
export const OccupationDefaultValues = {
  occupationName: '',
}

export const ReligionFormYup = yup.object().shape({
  religionName: yupStringReq,
})
export interface ReligionForm {
  title: string
}
export const ReligionDefaultValues = {
  religionName: '',
}

export const RecommendationFormYup = yup.object().shape({
  recommendationName: yupStringReq,
  requestId: yupNumReq,
})
export interface RecommendationForm {
  recommendationName: string
  requestId: number
}
export const RecommendationDefaultValues = {
  recommendationName: '',
  requestId: '',
}

export const BranchFormYup = yup.object().shape({
  branchName: yupStringReq,
  phone: yupString,
  address: yupStringReq,
  brgy_code: yupNumReq,
  city_code: yupNumReq,
  province_code: yupNumReq,
})
export const BranchDefaultValues = {
  branchName: '',
  phone: '',
  address: '',
  brgy_code: '',
  city_code: '',
  province_code: '',
}
export interface BranchForm {
  branchName: string
  firstName: string
  middleName?: string
  lastName: string
  phone?: string
  address: string
  brgy_code: number
  city_code: number
  province_code: number
}

export const RequirementsFormYup = yup.object().shape({
  requirementsName: yupStringReq,
})
export const RequirementsDefaultValue = {
  requirementsName: '',
}
export interface RequirementsForm {
  requirementsName: string
}

export const TypeRequestFormYup = yup.object().shape({
  requestName: yupStringReq,
  budgetFrom: yupNumReq,
  budgetTo: yup.lazy((value) =>
    value === ''
      ? yup.string().required('Thos field is required')
      : yup
          .number()
          .positive('Must be a positive number')
          .required('This field is required')
          .moreThan(
            yup.ref('budgetFrom'),
            'must be higher than Budget range "From'
          )
  ),
  description: yupStringReq,
  requirementsId: yupArray,
})
export const TypeRequestDefaultValue = {
  requestName: '',
  budgetFrom: '',
  budgetTo: '',
  requirementsId: '',
  description: '',
}
export interface TypeRequestForm {
  requestName: string
  budgetFrom: number
  budgetTo: number
  requirementsId: string[]
  description: string
}

export const BarangayFormYup = yup.object().shape({
  brgy_name: yupStringReq,
  city_code: yupNumReq,
})
export const BarangayDefaultValues = {
  brgy_name: '',
  city_code: '',
}
export interface BarangayForm {
  brgy_name: string
  city_code: number
}

export const CityFormYup = yup.object().shape({
  city_name: yupStringReq,
  province_code: yupNumReq,
})
export const CityDefaultValues = {
  city_name: '',
  province_code: '',
}
export interface CityForm {
  city_name: string
  province_code: number
}

export const ProvinceFormYup = yup.object().shape({
  province_name: yupStringReq,
})
export const ProvinceDefaultValues = {
  province_name: '',
}
export interface ProvinceForm {
  province_name: string
}

export const CaseHeadFormYup = yup.object().shape({
  note: yupStringReq,
  status: yupStringReq,
})
export const CaseHeadDefaultValues = {
  note: '',
  status: '',
}
export interface CaseHeadForm {
  note: string
  status: 'accept' | 'reject'
}

export const AssessmentFormYup = yup.object().shape({
  method: yupStringReq,
  findings: yupString,
  recommendationId: yupNumReq,
  recommendationDetails: yupString,
  CaseFileRequirement: yup.array().of(
    yup.object().shape({
      id: yupNumReq,
      submitted: yup.boolean(),
    })
  ),
})
export const AssessmentDefaultValues = {
  method: 'submit',
  findings: '',
  recommendationId: '',
  recommendationDetails: '',
  CaseFileRequirement: [{ id: '', submitted: false }],
}

export interface AssessmentForm {
  method: 'save' | 'submit'
  findings: string
  recommendationId: number
  recommendationDetails: string
  CaseFileRequirement: Array<{
    id: string | number
    submitted: boolean
  }>
}

export const BudgetFormYup = yup.object().shape({
  caseId: yupStringReq,
  amount: yupNum,
})
export const BudgetDefaultValues = {
  caseId: '',
  amount: '',
}
export interface BudgetForm {
  caseId: string
  amount: number
}

export const BudgetDetailFormYup = yup.object().shape({
  status: yupStringReq,
  remarks: yupStringReq,
})
export const BudgetDetailDefaultValues = {
  status: 'approved',
  remarks: '',
}
export interface BudgetDetailForm {
  status: 'approved' | 'declined'
  remarks: string
}

export const ProgressNoteFormYup = yup.object().shape({
  status: yupStringReq,
  caseId: yupStringReq,
  activity: yupStringReq,
  client: yupString,
  family: yupString,
  environment: yupString,
  church: yupString,
  livelihood: yupString,
  transpired: yupString,
})
export const ProgressNoteDefaultValues = {
  status: 'pending',
  caseId: '',
  activity: '',
  client: '',
  family: '',
  environment: '',
  church: '',
  livelihood: '',
  transpired: '',
}
export interface ProgressNoteForm {
  status: 'pending' | 'incomplete'
  caseId: number
  activity: string
  client: string
  family: string
  environment: string
  church: string
  livelihood: string
  transpired: string
}

export const ProgressNoteUpdateFormYup = yup.object().shape({
  status: yupStringReq,
  caseId: yupStringReq,
  activity: yupStringReq,
  client: yupString,
  family: yupString,
  environment: yupString,
  church: yupString,
  livelihood: yupString,
  transpired: yupString,
})
export const ProgressNoteUpdateDefaultValues = {
  status: 'pending',
  caseId: '',
  activity: '',
  client: '',
  family: '',
  environment: '',
  church: '',
  livelihood: '',
  transpired: '',
}
export interface ProgressNoteUpdateForm {
  status: 'pending' | 'incomplete'
  caseId: number
  activity: string
  client: string
  family: string
  environment: string
  church: string
  livelihood: string
  transpired: string
}

export const ProgressNoteRemarkFormYup = yup.object().shape({
  remark: yupStringReq,
})
export const ProgressNoteRemarkDefaultValues = {
  remark: '',
}
export interface ProgressNoteRemarkForm {
  remark: string
}

export const AdminCaseFormYup = yup.object().shape({
  userId: yupStringReq,
  status: yupString,
  requestId: yupNum,
  note: yupString,
  startDate: yupDateNotReq,
  endDate: yupDateNotReq,
  requestSummary: yupString,
  Background: yup.object().shape({
    firstName: yupStringReq,
    middleName: yupString,
    lastName: yupStringReq,
    nickname: yupString,
    age: yupNumReq,
    sex: yupStringReq,
    civilStatus: yupStringReq,
    birthDate: yupDate,
    phone: yupString,
    occupationId: yupNum,
    address: yupString,
    street: yupString,
    brgy_code: yupNumReq,
    city_code: yupNumReq,
    province_code: yupNumReq,
    religionId: yupNum,
    educationId: yupNum,
    incomeId: yupNum,
    Family: yup.array().of(
      yup.object().shape({
        firstName: yupStringReq,
        middleName: yupString,
        lastName: yupStringReq,
        age: yupNumReq,
        educationId: yupNum,
        incomeId: yupNum,
        occupationId: yupNum,
      })
    ),
  }),
})
export interface AdminCaseForm {
  userId: string
  status: string
  requestId: number
  requestSummary: string
  note: string
  startDate: Date
  endDate: Date
  Background: {
    firstName: string
    middleName?: string
    lastName: string
    nickname?: string
    age: number
    sex: string
    civilStatus: string
    phone?: string
    birthDate: Date
    occupationId?: number
    address?: string
    street?: string
    brgy_code?: number
    city_code?: number
    province_code?: number
    religionId?: number
    educationId?: number
    incomeId?: number
    Family?: {
      firstName: string
      middleName?: string
      lastName: string
      age: number
      educationId?: number
      incomeId?: number
      occupationId?: number
    }[]
  }
}
export const AdminCaseDefaultValues = {
  userId: '',
  status: '',
  requestId: '',
  requestSummary: '',
  startDate: '',
  endDate: '',
  note: '',
  Background: {
    firstName: '',
    middleName: '',
    lastName: '',
    nickname: '',
    age: '',
    sex: '',
    civilStatus: '',
    phone: '',
    birthDate: '',
    occupationId: '',
    address: '',
    street: '',
    brgy_code: '',
    city_code: '',
    province_code: '',
    religionId: '',
    educationId: '',
    incomeId: '',
    Family: [
      {
        firstName: '',
        middleName: '',
        lastName: '',
        age: '',
        educationId: '',
        incomeId: '',
        occupationId: '',
      },
    ],
  },
}

export const AdminCaseFormUpdateYup = yup.object().shape({
  userId: yupStringReq,
  status: yupStringReq,
  caseStatus: yupString,
  requestId: yupNum,
  requestSummary: yupString,
  note: yupString,
  startDate: yupDateNotReq,
  endDate: yupDateNotReq,
  Background: yup.object().shape({
    firstName: yupStringReq,
    middleName: yupString,
    lastName: yupStringReq,
    nickname: yupString,
    age: yupNumReq,
    sex: yupStringReq,
    civilStatus: yupStringReq,
    birthDate: yupDate,
    phone: yupString,
    occupationId: yupNum,
    address: yupString,
    street: yupString,
    brgy_code: yupNum,
    city_code: yupNum,
    province_code: yupNum,
    religionId: yupNum,
    educationId: yupNum,
    incomeId: yupNum,
    Family: yup.array().of(
      yup.object().shape({
        id: yupNumReq,
        firstName: yupStringReq,
        middleName: yupString,
        lastName: yupStringReq,
        age: yupNumReq,
        educationId: yupNum,
        incomeId: yupNum,
        occupationId: yupNum,
      })
    ),
  }),
})
export interface AdminCaseUpdateForm {
  caseId: string
  status: string
  requestId: number
  requestSummary: string
  note: string
  startDate: Date
  endDate: Date
  Background: {
    firstName: string
    middleName?: string
    lastName: string
    nickname?: string
    age: number
    sex: string
    civilStatus: string
    phone?: string
    birthDate: Date
    occupationId?: number
    address?: string
    street?: string
    brgy_code?: number
    city_code?: number
    province_code?: number
    religionId?: number
    educationId?: number
    incomeId?: number
    Family?: {
      id: number
      firstName: string
      middleName?: string
      lastName: string
      age: number
      educationId?: number
      incomeId?: number
      occupationId?: number
    }[]
  }
}
export const AdminCaseUpdateDefaultValues = {
  userId: '',
  status: '',
  requestId: '',
  requestSummary: '',
  note: '',
  startDate: '',
  endDate: '',
  Background: {
    firstName: '',
    middleName: '',
    lastName: '',
    nickname: '',
    age: '',
    sex: '',
    civilStatus: '',
    phone: '',
    birthDate: '',
    occupationId: '',
    address: '',
    street: '',
    brgy_code: '',
    city_code: '',
    province_code: '',
    religionId: '',
    educationId: '',
    incomeId: '',
    Family: [
      {
        id: '',
        firstName: '',
        middleName: '',
        lastName: '',
        age: '',
        educationId: '',
        incomeId: '',
        occupationId: '',
      },
    ],
  },
}

export const AdminProgressNoteFormYup = yup.object().shape({
  status: yupStringReq,
  caseId: yupStringReq,
  activity: yupStringReq,
  client: yupString,
  family: yupString,
  environment: yupString,
  church: yupString,
  livelihood: yupString,
  transpired: yupString,
  remark: yupString,
})
export const AdminProgressNoteDefaultValues = {
  status: '',
  caseId: '',
  activity: '',
  client: '',
  family: '',
  environment: '',
  church: '',
  livelihood: '',
  transpired: '',
  remark: '',
}
export interface AdminProgressNoteForm {
  status: string
  caseId: number
  activity: string
  client: string
  family: string
  environment: string
  church: string
  livelihood: string
  transpired: string
  remark: string
}

export const AdminBudgetFormYup = yup.object().shape({
  caseId: yupStringReq,
  amount: yupNum,
  status: yupStringReq,
})
export const AdminBudgetDefaultValues = {
  caseId: '',
  amount: '',
  status: '',
}
export interface AdminBudgetForm {
  caseId: string
  amount: number
  status: string
}

export const AssessmentConfirmationYup = yup.object().shape({
  remark: yupStringReq,
})

export const LiquidationFormYup = yup.object().shape({
  liquidation: yup.array().of(
    yup.object().shape({
      article: yupStringReq,
      qty: yupNumReq,
      unit: yupString,
      price: yupNumReq,
    })
  ),
})
export const LiquidationDefaultValues = {
  liquidation: [{ article: '', qty: '', unit: '', price: '' }],
}
export interface LiquidationForm {
  liquidation: {
    article: string
    qty: number
    unit: string
    price: number
  }[]
}
