import { FlowItem } from 'models/flows';
import { request } from 'umi';
import type { FlowListParams, newQuestionItem, DropdownProps } from './data.d';

export async function uploadFile(params?: FlowListParams) {
  let { sorter, filter, ...searchParam } = params;
  let sortQuery: string = '';
  if (Object.keys(sorter).length !== 0) {
    let temp: string[] = [];
    for (const [key, value] of Object.entries(sorter)) {
      if (value === 'ascend') {
        temp.push(`+${key}`);
      } else {
        temp.push(`-${key}`);
      }
      sortQuery = temp.join();
    }
    searchParam = { ...searchParam, sortBy: sortQuery };
  }
  params = { ...searchParam };

  // return request('/api/rule', {
  return request('http://localhost:5000/flows', {
    params,
  });
}

export async function queryTopics() {
  const topics: string[] = await request('http://localhost:5000/questions/topics');
  let results: DropdownProps[] = [];
  topics.forEach((topic) => results.push({ label: topic, value: topic, key: topic }));
  return results;
}

export async function removeQuestion(params: { key: string[] }) {
  console.log(params);
  return request('http://localhost:5000/questions/', {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}

export async function addQuestion(params: newQuestionItem) {
  return request('http://localhost:5000/questions/', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function editQuestion(params: newQuestionItem) {
  return request('http://localhost:5000/questions', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params: QuestionListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}

export async function queryFlow(
  id: string
): Promise<{ flow: FlowItem[] }> {
  return request(`http://localhost:5000/flows/${id}`);
}
