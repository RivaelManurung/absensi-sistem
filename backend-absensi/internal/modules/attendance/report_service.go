package attendance

import (
	"backend-absensi/internal/pkg/response"
	"math"
)

type ReportService interface {
	GetReport(filters map[string]interface{}, page, limit int) (*response.PageData, interface{}, error)
}

type reportService struct {
	repo Repository
}

func NewReportService(repo Repository) ReportService {
	return &reportService{repo}
}

func (s *reportService) GetReport(filters map[string]interface{}, page, limit int) (*response.PageData, interface{}, error) {
	items, total, err := s.repo.GetReport(filters, page, limit)
	if err != nil {
		return nil, nil, err
	}

	summary, err := s.repo.GetReportSummary(filters)
	if err != nil {
		return nil, nil, err
	}

	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	return &response.PageData{
		Items: items,
		Meta: response.Meta{
			Page:       page,
			Limit:      limit,
			Total:      total,
			TotalPages: totalPages,
		},
	}, summary, nil
}
